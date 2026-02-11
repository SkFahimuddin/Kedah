const Complaint = require('../models/Complaint');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    const complaintData = {
      ...req.body,
      createdBy: req.user._id
    };

    const complaint = await Complaint.create(complaintData);

    res.status(201).json({
      status: 'success',
      message: 'Complaint registered successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating complaint'
    });
  }
};

// @desc    Get all complaints with filtering
// @route   GET /api/complaints
// @access  Private
exports.getAllComplaints = async (req, res) => {
  try {
    const {
      status,
      priority,
      complaintType,
      assignedTo,
      zone,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = '-createdAt'
    } = req.query;

    // Build query
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (complaintType) query.complaintType = complaintType;
    if (assignedTo) query.assignedTo = assignedTo;
    if (zone) query['address.zone'] = zone;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Role-based filtering
    if (req.user.role === 'technician') {
      query.assignedTo = req.user._id;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const complaints = await Complaint.find(query)
      .populate('assignedTo', 'firstName lastName employeeId')
      .populate('resolvedBy', 'firstName lastName')
      .populate('createdBy', 'firstName lastName')
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Complaint.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: complaints.length,
      data: {
        complaints,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalComplaints: total
        }
      }
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching complaints'
    });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName phoneNumber employeeId')
      .populate('resolvedBy', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { complaint }
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching complaint'
    });
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
exports.updateComplaint = async (req, res) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    // Update complaint
    complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo resolvedBy createdBy');

    res.status(200).json({
      status: 'success',
      message: 'Complaint updated successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating complaint'
    });
  }
};

// @desc    Assign complaint to technician
// @route   PUT /api/complaints/:id/assign
// @access  Private (Supervisor/Admin)
exports.assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo,
        assignedDate: new Date(),
        status: 'Assigned'
      },
      { new: true }
    ).populate('assignedTo');

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Complaint assigned successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error assigning complaint'
    });
  }
};

// @desc    Resolve complaint
// @route   PUT /api/complaints/:id/resolve
// @access  Private (Technician/Supervisor/Admin)
exports.resolveComplaint = async (req, res) => {
  try {
    const { resolutionNotes } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Resolved',
        resolvedDate: new Date(),
        resolvedBy: req.user._id,
        resolutionNotes
      },
      { new: true }
    ).populate('resolvedBy');

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Complaint resolved successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Resolve complaint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error resolving complaint'
    });
  }
};

// @desc    Get complaint statistics
// @route   GET /api/complaints/stats
// @access  Private
exports.getComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $facet: {
          statusStats: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          priorityStats: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ],
          typeStats: [
            { $group: { _id: '$complaintType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          avgResponseTime: [
            { $match: { responseTime: { $exists: true } } },
            { $group: { _id: null, avg: { $avg: '$responseTime' } } }
          ],
          avgResolutionTime: [
            { $match: { resolutionTime: { $exists: true } } },
            { $group: { _id: null, avg: { $avg: '$resolutionTime' } } }
          ]
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: { stats: stats[0] }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching statistics'
    });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin only)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting complaint'
    });
  }
};
