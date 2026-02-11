const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaint,
  updateComplaint,
  assignComplaint,
  resolveComplaint,
  getComplaintStats,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.route('/')
  .get(getAllComplaints)
  .post(authorize('admin', 'supervisor', 'customer_service'), createComplaint);

router.get('/stats', authorize('admin', 'supervisor'), getComplaintStats);

router.route('/:id')
  .get(getComplaint)
  .put(authorize('admin', 'supervisor', 'technician'), updateComplaint)
  .delete(authorize('admin'), deleteComplaint);

router.put('/:id/assign', authorize('admin', 'supervisor'), assignComplaint);
router.put('/:id/resolve', authorize('admin', 'supervisor', 'technician'), resolveComplaint);

module.exports = router;
