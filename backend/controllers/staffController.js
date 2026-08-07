const Admin = require('../models/Admin');
const Event = require('../models/Event');
const bcrypt = require('bcryptjs');

// GET /api/staff — list staff for the calling admin's org
exports.getStaff = async (req, res) => {
    try {
        const staff = await Admin.find({
            role: 'staff',
            organizationId: req.user.id,
        }).select('-password').lean();
        res.status(200).json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/staff — create staff account
exports.createStaff = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email and password are required' });
        }
        const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (existing) return res.status(409).json({ error: 'Email already registered' });

        const callerAdmin = await Admin.findById(req.user.id).select('organizationName').lean();
        const hashed = await bcrypt.hash(password, 12);
        const staff = await Admin.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashed,
            role: 'staff',
            organizationId: req.user.id,
            organizationName: callerAdmin ? callerAdmin.organizationName : '',
            createdBy: req.user.id,
            secretKeyVerified: true,
        });
        const { password: _p, ...staffData } = staff.toObject();
        res.status(201).json({ success: true, staff: staffData });
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ error: 'Email already registered' });
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/staff/:id
exports.deleteStaff = async (req, res) => {
    try {
        const staff = await Admin.findById(req.params.id);
        if (!staff || staff.role !== 'staff') return res.status(404).json({ error: 'Staff not found' });
        if (staff.organizationId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this staff' });
        }
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Staff deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/staff/assign — assign staff to an event
exports.assignStaffToEvent = async (req, res) => {
    try {
        const { staffId, eventId } = req.body;
        if (!staffId || !eventId) return res.status(400).json({ error: 'staffId and eventId are required' });

        const staff = await Admin.findById(staffId);
        if (!staff || staff.role !== 'staff') return res.status(404).json({ error: 'Staff not found' });
        if (staff.organizationId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Staff does not belong to your organization' });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Event does not belong to your organization' });
        }

        if (!event.assignedStaff.map(String).includes(String(staffId))) {
            event.assignedStaff.push(staffId);
            await event.save();
        }
        res.status(200).json({ success: true, message: 'Staff assigned to event' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/staff/assigned-events — for logged-in staff, fetch their assigned events
exports.getAssignedEvents = async (req, res) => {
    try {
        const events = await Event.find({ assignedStaff: req.user.id }).lean();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/staff/org-events — org admin fetches their own events (for assignment UI)
exports.getOrgEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user.id }).lean();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
