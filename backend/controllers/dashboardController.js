const Complaint = require('../models/Complaint');
const MeterReading = require('../models/MeterReading');
const Asset = require('../models/Asset');
const Maintenance = require('../models/Maintenance');
const WaterProduction = require('../models/WaterProduction');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private
exports.getDashboardOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Date range for filtering
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    } else {
      // Default to last 30 days
      dateFilter.createdAt = {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      };
    }

    // Parallel data fetching for performance
    const [
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalAssets,
      operationalAssets,
      maintenanceAssets,
      totalTasks,
      pendingTasks,
      overdueTasks,
      totalUsers,
      activeUsers,
      recentProduction
    ] = await Promise.all([
      Complaint.countDocuments(dateFilter),
      Complaint.countDocuments({ ...dateFilter, status: { $in: ['Pending', 'Assigned'] } }),
      Complaint.countDocuments({ ...dateFilter, status: 'Resolved' }),
      Asset.countDocuments(),
      Asset.countDocuments({ status: 'Operational' }),
      Asset.countDocuments({ status: 'Under Maintenance' }),
      Task.countDocuments(dateFilter),
      Task.countDocuments({ ...dateFilter, status: 'Pending' }),
      Task.countDocuments({ ...dateFilter, isOverdue: true }),
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      WaterProduction.find({ productionDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
        .select('productionDate production.volumeProduced facility')
        .sort('-productionDate')
        .limit(7)
    ]);

    // Calculate resolution rate
    const resolutionRate = totalComplaints > 0 
      ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) 
      : 0;

    // Calculate task completion rate
    const completedTasks = await Task.countDocuments({ ...dateFilter, status: 'Completed' });
    const taskCompletionRate = totalTasks > 0 
      ? ((completedTasks / totalTasks) * 100).toFixed(2) 
      : 0;

    // Calculate average response time
    const avgResponseTime = await Complaint.aggregate([
      { $match: { ...dateFilter, responseTime: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$responseTime' } } }
    ]);

    // Calculate total water production for the period
    const totalProduction = recentProduction.reduce(
      (sum, record) => sum + (record.production?.volumeProduced || 0), 
      0
    );

    res.status(200).json({
      status: 'success',
      data: {
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          resolved: resolvedComplaints,
          resolutionRate: parseFloat(resolutionRate),
          avgResponseTime: avgResponseTime[0]?.avg || 0
        },
        assets: {
          total: totalAssets,
          operational: operationalAssets,
          underMaintenance: maintenanceAssets,
          operationalPercentage: totalAssets > 0 
            ? ((operationalAssets / totalAssets) * 100).toFixed(2) 
            : 0
        },
        tasks: {
          total: totalTasks,
          pending: pendingTasks,
          overdue: overdueTasks,
          completionRate: parseFloat(taskCompletionRate)
        },
        users: {
          total: totalUsers,
          active: activeUsers
        },
        waterProduction: {
          totalLast7Days: totalProduction,
          recentRecords: recentProduction
        }
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching dashboard data'
    });
  }
};

// @desc    Get complaint analytics
// @route   GET /api/dashboard/complaint-analytics
// @access  Private
exports.getComplaintAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    const analytics = await Complaint.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $facet: {
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ],
          byType: [
            { $group: { _id: '$complaintType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byZone: [
            { $group: { _id: '$address.zone', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          dailyTrend: [
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ],
          performanceMetrics: [
            {
              $group: {
                _id: null,
                avgResponseTime: { $avg: '$responseTime' },
                avgResolutionTime: { $avg: '$resolutionTime' },
                totalResolved: {
                  $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
                }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: { analytics: analytics[0] }
    });
  } catch (error) {
    console.error('Complaint analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching complaint analytics'
    });
  }
};

// @desc    Get water production analytics
// @route   GET /api/dashboard/production-analytics
// @access  Private
exports.getProductionAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    const analytics = await WaterProduction.aggregate([
      { $match: { productionDate: { $gte: startDate } } },
      {
        $facet: {
          totalProduction: [
            {
              $group: {
                _id: null,
                total: { $sum: '$production.volumeProduced' },
                avg: { $avg: '$production.volumeProduced' }
              }
            }
          ],
          byFacility: [
            {
              $group: {
                _id: '$facility',
                total: { $sum: '$production.volumeProduced' },
                avg: { $avg: '$production.volumeProduced' }
              }
            }
          ],
          dailyProduction: [
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$productionDate' } },
                volume: { $sum: '$production.volumeProduced' }
              }
            },
            { $sort: { _id: 1 } }
          ],
          waterQualityTrend: [
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$productionDate' } },
                avgPH: { $avg: '$waterQuality.pH' },
                avgTurbidity: { $avg: '$waterQuality.turbidity.value' },
                avgChlorine: { $avg: '$waterQuality.chlorine.value' }
              }
            },
            { $sort: { _id: 1 } }
          ],
          nonRevenueWater: [
            {
              $group: {
                _id: null,
                totalNRW: { $sum: '$distribution.nonRevenueWater' },
                avgLossPercentage: { $avg: '$distribution.percentageLoss' }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: { analytics: analytics[0] }
    });
  } catch (error) {
    console.error('Production analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching production analytics'
    });
  }
};

// @desc    Get maintenance analytics
// @route   GET /api/dashboard/maintenance-analytics
// @access  Private
exports.getMaintenanceAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    const analytics = await Maintenance.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $facet: {
          byType: [
            { $group: { _id: '$maintenanceType', count: { $sum: 1 } } }
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          costAnalysis: [
            {
              $group: {
                _id: null,
                totalCost: { $sum: '$workDetails.totalCost' },
                avgCost: { $avg: '$workDetails.totalCost' }
              }
            }
          ],
          downtimeAnalysis: [
            {
              $group: {
                _id: null,
                totalDowntime: { $sum: '$downtime' },
                avgDowntime: { $avg: '$downtime' }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: { analytics: analytics[0] }
    });
  } catch (error) {
    console.error('Maintenance analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching maintenance analytics'
    });
  }
};

// @desc    Get performance KPIs
// @route   GET /api/dashboard/kpis
// @access  Private (Supervisor/Admin)
exports.getKPIs = async (req, res) => {
  try {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Current month metrics
    const [currentMetrics, lastMonthMetrics] = await Promise.all([
      getMonthlyMetrics(currentMonth),
      getMonthlyMetrics(lastMonth)
    ]);

    // Calculate percentage changes
    const kpis = {
      complaintResolutionRate: {
        current: currentMetrics.resolutionRate,
        previous: lastMonthMetrics.resolutionRate,
        change: calculatePercentageChange(
          lastMonthMetrics.resolutionRate,
          currentMetrics.resolutionRate
        )
      },
      avgResponseTime: {
        current: currentMetrics.avgResponseTime,
        previous: lastMonthMetrics.avgResponseTime,
        change: calculatePercentageChange(
          lastMonthMetrics.avgResponseTime,
          currentMetrics.avgResponseTime
        )
      },
      waterProduction: {
        current: currentMetrics.totalProduction,
        previous: lastMonthMetrics.totalProduction,
        change: calculatePercentageChange(
          lastMonthMetrics.totalProduction,
          currentMetrics.totalProduction
        )
      },
      nrwPercentage: {
        current: currentMetrics.nrwPercentage,
        previous: lastMonthMetrics.nrwPercentage,
        change: calculatePercentageChange(
          lastMonthMetrics.nrwPercentage,
          currentMetrics.nrwPercentage
        )
      },
      assetUtilization: {
        current: currentMetrics.assetUtilization,
        previous: lastMonthMetrics.assetUtilization,
        change: calculatePercentageChange(
          lastMonthMetrics.assetUtilization,
          currentMetrics.assetUtilization
        )
      }
    };

    res.status(200).json({
      status: 'success',
      data: { kpis }
    });
  } catch (error) {
    console.error('KPIs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching KPIs'
    });
  }
};

// Helper function to get monthly metrics
async function getMonthlyMetrics(startDate) {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const [complaints, production, assets] = await Promise.all([
    Complaint.aggregate([
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]),
    WaterProduction.aggregate([
      { $match: { productionDate: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: null,
          totalProduction: { $sum: '$production.volumeProduced' },
          avgNRW: { $avg: '$distribution.percentageLoss' }
        }
      }
    ]),
    Asset.countDocuments({ status: 'Operational' })
  ]);

  const totalAssets = await Asset.countDocuments();

  return {
    resolutionRate: complaints[0]
      ? (complaints[0].resolved / complaints[0].total * 100).toFixed(2)
      : 0,
    avgResponseTime: complaints[0]?.avgResponseTime || 0,
    totalProduction: production[0]?.totalProduction || 0,
    nrwPercentage: production[0]?.avgNRW || 0,
    assetUtilization: totalAssets > 0 ? (assets / totalAssets * 100).toFixed(2) : 0
  };
}

// Helper function to calculate percentage change
function calculatePercentageChange(oldValue, newValue) {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return (((newValue - oldValue) / oldValue) * 100).toFixed(2);
}
