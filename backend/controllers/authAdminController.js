const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const ALLOWED_ROLES = ['superadmin', 'admin', 'volunteer'];


const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET environment variable is not set');
    return secret;
};

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password, adminKey } = req.body;

        if (!name || !email || !password || !adminKey) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Only allow admin-level registration through this route
        if (adminKey.trim() !== getAdminSecret().trim()) {
            return res.status(403).json({ error: 'Invalid admin key' });
        }
        console.log("BODY:", req.body);

        console.log(
            "Received adminKey:",
            `"${adminKey}"`
        );

        console.log(
            "ENV adminKey:",
            `"${process.env.ADMIN_SECRET_KEY}"`
        );

        console.log(
            "Equal?",
            adminKey === process.env.ADMIN_SECRET_KEY
        );

        req.body.role = 'admin';
        return exports.signupAdmin(req, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, secretKey, adminKey } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const key = secretKey || adminKey;
        let role;


        if (key === getSuperadminSecret()) {
            role = 'superadmin';
        } else if (key === getAdminSecret()) {
            role = 'admin';
        } else {
            return res.status(403).json({ error: 'Invalid secret key' });
        }


        const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashed = await bcrypt.hash(password, 12); //  Increase salt rounds from 10 to 12

        const admin = await Admin.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashed,
            role,
            secretKeyVerified: true,
        });

        res.status(201).json({
            success: true,
            role: admin.role,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.signupAdmin = exports.signup;

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

        // FIX 6: Use a generic message to avoid user enumeration attacks
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                organizationId: user.organizationId || null,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            success: true,
            token,
            role: user.role,
            name: user.name,
            admin: { id: user._id, name: user.name, email: user.email },
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginAdmin = exports.login;


//   - superadmin  → sees all admins and volunteers (not just superadmins)
//   - admin       → sees only volunteers
exports.getAllAdmins = async (req, res) => {
    try {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (req.user.role === 'superadmin') {
            // Superadmin sees everyone except other superadmins (or all — adjust to your needs)
            const admins = await Admin.find({ role: { $in: ['admin', 'volunteer'] } }).select('-password');
            return res.status(200).json(admins);
        }

        if (req.user.role === 'admin') {
            const volunteers = await Admin.find({ role: 'volunteer' }).select('-password');
            return res.status(200).json(volunteers);
        }

        // Volunteers have no access to admin lists
        return res.status(403).json({ error: 'Forbidden' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteAdmin = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'superadmin') {
            return res.status(403).json({ error: 'Only superadmins can delete admins' });
        }

        const { id } = req.params;

        const target = await Admin.findById(id);
        if (!target) {
            return res.status(404).json({ error: 'Admin not found' });
        }


        if (target._id.toString() === req.user.id.toString()) {
            return res.status(400).json({ error: 'You cannot delete your own account' });
        }

        await Admin.findByIdAndDelete(id);
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.assignVolunteer = async (req, res) => {
    try {
        if (!req.user || !['superadmin', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Only admins can assign volunteers' });
        }

        const { volunteerId, eventId } = req.body;

        if (!volunteerId || !eventId) {
            return res.status(400).json({ error: 'volunteerId and eventId are required' });
        }


        const volunteer = await Admin.findById(volunteerId);
        if (!volunteer || volunteer.role !== 'volunteer') {
            return res.status(404).json({ error: 'Volunteer not found' });
        }

        const Event = require('../models/Event');


        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }


        if (event.assignedVolunteers.includes(volunteerId)) {
            return res.status(409).json({ error: 'Volunteer already assigned to this event' });
        }

        event.assignedVolunteers.push(volunteerId);
        await event.save();

        res.status(200).json({ message: 'Volunteer assigned successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProfile =
    async (req, res) => {

        try {

            const admin =
                await Admin.findById(
                    req.user.id
                ).select("-password");

            res.json(admin);

        } catch (err) {

            res.status(500).json({
                error: err.message
            });
        }
    };
exports.getDashboard = async (req, res) => {
    try {


        if (req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "Access Denied"
            });
        }


        const totalOrganizations = await Admin.countDocuments({
            role: "admin"
        });

        const totalUsers = await User.countDocuments({
            role: "student"
        });

        const totalEvents = await Event.countDocuments();

        const totalRegistrations = await Registration.countDocuments();

        return res.status(200).json({
            totalOrganizations,
            totalUsers,
            totalEvents,
            totalRegistrations
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
};