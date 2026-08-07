const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

router.post(
    "/register",
    protect,
    authorize("student"),
    ticketController.registerForEvent
);
router.get(

    "/my-registrations",

    protect,
    authorize("student"),

    ticketController.getMyRegistrations
);
router.post(
    '/verify',
    protect,
    authorize('volunteer', 'admin', 'superadmin', 'staff'),
    ticketController.verifyTicket
);
router.get(
    '/recent-verifications',
    protect,
    authorize('volunteer', 'admin', 'superadmin', 'staff'),
    async (req, res) => {
        try {
            const Registration = require('../models/Registration');
            const recent = await Registration.find({ verified: true })
                .sort({ updatedAt: -1 })
                .limit(20)
                .populate('event', 'title');
            res.status(200).json(recent);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// NOTE: /:regId must come AFTER all named routes to avoid swallowing them
router.get('/:regId', protect, authorize("student"), ticketController.getTicketById);
module.exports = router;