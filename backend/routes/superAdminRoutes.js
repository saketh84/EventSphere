const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const ctrl = require('../controllers/superAdminController');

const superOnly = [protect, authorize('superadmin')];

router.get('/dashboard', ...superOnly, ctrl.getDashboard);
router.get('/admins', ...superOnly, ctrl.getAdmins);
router.post('/admins', ...superOnly, ctrl.createAdmin);
router.delete('/admins/:id', ...superOnly, ctrl.deleteAdmin);
router.get('/organizations', ...superOnly, ctrl.getOrganizations);
router.get('/events', ...superOnly, ctrl.getAllEvents);

module.exports = router;
