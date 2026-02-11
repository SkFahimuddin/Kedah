const express = require('express');
const router = express.Router();
const {
  getDashboardOverview,
  getComplaintAnalytics,
  getProductionAnalytics,
  getMaintenanceAnalytics,
  getKPIs
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// Protect all dashboard routes
router.use(protect);

router.get('/overview', getDashboardOverview);
router.get('/complaint-analytics', getComplaintAnalytics);
router.get('/production-analytics', authorize('admin', 'supervisor'), getProductionAnalytics);
router.get('/maintenance-analytics', authorize('admin', 'supervisor'), getMaintenanceAnalytics);
router.get('/kpis', authorize('admin', 'supervisor'), getKPIs);

module.exports = router;
