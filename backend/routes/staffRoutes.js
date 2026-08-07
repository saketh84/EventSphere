const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const ctrl = require('../controllers/staffController');

// Admin manages staff
router.get('/', protect, authorize('admin'), ctrl.getStaff);
router.post('/', protect, authorize('admin'), ctrl.createStaff);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteStaff);
router.post('/assign', protect, authorize('admin'), ctrl.assignStaffToEvent);
router.get('/org-events', protect, authorize('admin'), ctrl.getOrgEvents);

// Staff fetches their assigned events
router.get('/assigned-events', protect, authorize('staff'), ctrl.getAssignedEvents);

module.exports = router;
