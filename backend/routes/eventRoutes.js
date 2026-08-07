const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const isEventOwner = require('../middleware/isEventOwner');
const { protect } = require('../middleware/authMiddleware');
const authorize = require("../middleware/authorize");
const eventController = require('../controllers/eventController');
const Event = require('../models/Event');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: 'events',
        resource_type: 'image',
        public_id: `event_${Date.now()}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    }),
});

const fileSizeLimitMB = 5;
const upload = multer({
    storage,
    limits: { fileSize: fileSizeLimitMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
});
router.get('/all', eventController.getAllEvents);

// GET /api/events/featured — public, returns upcoming events (no auth needed)
router.get('/featured', async (req, res) => {
    try {
        const Event = require('../models/Event');
        const events = await Event.find({ date: { $gte: new Date() } })
            .sort({ date: 1 })
            .limit(6);
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/events/manage — returns events created by the logged-in admin
router.get(
    '/manage',
    protect,
    authorize('admin', 'superadmin'),
    async (req, res) => {
        try {
            const Event = require('../models/Event');
            const query = req.user.role === 'superadmin'
                ? {}
                : { createdBy: req.user.id };
            const events = await Event.find(query).sort({ createdAt: -1 });
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.get(

    "/monitor",

    protect,

    authorize(
        "admin",
        "superadmin"
    ),

    eventController.getMonitorData
);

router.post('/notify/:id', protect, authorize(
    "admin",
    "superadmin"
), eventController.notifyParticipants);
router.get(

    "/:id/registrations",

    protect,

    authorize(
        "admin",
        "superadmin"
    ),

    isEventOwner,

    eventController.getEventRegistrations
);
router.get('/:id', protect, eventController.getEventById);
router.post(
    '/manage',
    protect,
    authorize('admin', 'superadmin'),
    (req, res, next) => {
        upload.single('image')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    },
    eventController.addEvent
);

router.delete(

    "/:id",

    protect,

    authorize(
        "admin",
        "superadmin"
    ),

    isEventOwner,

    eventController.deleteEvent
);

router.put(
    '/:id',
    protect,
    authorize('admin', 'superadmin'),
    isEventOwner,
    (req, res, next) => {
        upload.single('image')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    },
    eventController.updateEvent
);

module.exports = router;