const Admin = require('../models/Admin');
const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');
const bcrypt = require('bcryptjs');

// GET /api/superadmin/admins — list all org admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'admin' }).select('-password').lean();
        res.status(200).json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/superadmin/admins — create org admin
exports.createAdmin = async (req, res) => {
    try {
        const { name, organizationName, email, password } = req.body;
        if (!name || !organizationName || !email || !password) {
            return res.status(400).json({ error: 'name, organizationName, email, password are required' });
        }
        const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (existing) return res.status(409).json({ error: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 12);
        const admin = await Admin.create({
            name,
            organizationName,
            email: email.toLowerCase().trim(),
            password: hashed,
            role: 'admin',
            secretKeyVerified: true,
            isFirstLogin: true,
        });
        const { password: _p, ...adminData } = admin.toObject();
        res.status(201).json({ success: true, admin: adminData });
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ error: 'Email already registered' });
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/superadmin/admins/:id
exports.deleteAdmin = async (req, res) => {
    try {
        const target = await Admin.findById(req.params.id);
        if (!target) return res.status(404).json({ error: 'Admin not found' });
        if (target.role === 'superadmin') return res.status(400).json({ error: 'Cannot delete superadmin' });
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Admin deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/superadmin/organizations — org admins with their events
exports.getOrganizations = async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'admin' }).select('-password').lean();
        const result = await Promise.all(admins.map(async (admin) => {
            const events = await Event.find({ createdBy: admin._id }).select('title date venue').lean();
            return { ...admin, events };
        }));
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/superadmin/events — all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}).populate('createdBy', 'name organizationName').lean();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/superadmin/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const [totalOrganizations, totalEvents, totalUsers, totalRegistrations] = await Promise.all([
            Admin.countDocuments({ role: 'admin' }),
            Event.countDocuments(),
            User.countDocuments(),
            Registration.countDocuments(),
        ]);
        res.status(200).json({ totalOrganizations, totalEvents, totalUsers, totalRegistrations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
