const Registration = require('../models/Registration');
const Event = require('../models/Event');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.registerForEvent = async (req, res) => {
    try {

        const body = req.body || {};

        const {
            eventId,
            studentName,
            studentEmail,
            collegeId,
            department,
            year,
            phone
        } = body;

        if (
            !eventId ||
            !studentName ||
            !studentEmail ||
            !collegeId
        ) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

        const existing = await Registration.findOne({
            event: eventId,
            user: req.user.id,
            studentEmail
        });

        if (existing) {
            return res.status(400).json({
                error: "Already registered"
            });
        }

        const regId =
            `REG-${Date.now()}`;
        if (!req.user || !req.user.id) {

            return res.status(401).json({
                success: false,
                error: "User authentication failed"
            });
        }

        console.log("Authenticated User:", req.user);

        const registration =
            await Registration.create({

                event: eventId,
                user: req.user.id,
                studentName,

                studentEmail,

                collegeId,

                department: department || "",

                year: year || "",

                phone: phone || "",

                reg_id: regId,

                userName: studentName,

                userEmail: studentEmail
            });


        res.status(201).json({
            success: true,
            reg_id: registration.reg_id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};
exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Registration
            .findOne({ reg_id: req.params.regId })
            .populate('event');

        if (!ticket) {
            return res.status(404).json({
                message: 'Ticket not found'
            });
        }

        res.status(200).json(ticket);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// BUG: createCheckoutSession has wrong amount calculation
exports.createCheckoutSession = async (req, res) => {
    try {
        const { eventId, studentName, studentEmail, collegeId } = req.body;
        const event = await Event.findById(eventId);

        // BUG: Wrong amount - Stripe expects cents but sending dollars
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: { name: event.title },
                    unit_amount: event.price,  // BUG: Should be event.price * 100
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.json({ url: session.url });
    } catch (err) {
        res.status(200).json({ error: err.message });
    }
};
exports.verifyTicket = async (req, res) => {
    try {
        const { qrCodeId } = req.body;
        const ticket = await Registration.findOne({ reg_id: qrCodeId });

        if (!ticket) {
            return res.status(200).json({ status: "Invalid" });
        }
        res.json({
            status: "Verified",
            message: "Welcome!"
        });
    } catch (err) {
        res.status(200).json({ error: "Verification failed" });
    }
};

exports.getMyRegistrations = async (req, res) => {
    try {

        console.log("Authenticated User:", req.user);

        const registrations = await Registration.find({
            user: req.user.id
        })
            .populate("event")
            .sort({ createdAt: -1 });

        return res.status(200).json(registrations);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};