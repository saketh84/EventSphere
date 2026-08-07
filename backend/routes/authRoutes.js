const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/signup', signup);
router.post('/login', login);

// GET /api/auth/profile — returns the logged-in student's profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/auth/profile/update — update student profile fields
router.put('/profile/update', protect, async (req, res) => {
    try {
        const { name, phone, collegeId, department, year } = req.body;
        const updateFields = {};
        if (name) updateFields.name = name.trim();
        if (phone !== undefined) updateFields.phone = phone;
        if (collegeId !== undefined) updateFields.collegeId = collegeId;
        if (department !== undefined) updateFields.department = department;
        if (year !== undefined) updateFields.year = year;

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updated) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;