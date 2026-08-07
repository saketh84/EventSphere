require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const authAdminRoutes = require('./routes/authAdminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const staffRoutes = require('./routes/staffRoutes');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000" }
});

connectDB();
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;

    try {

        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log(`Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const io = app.get('socketio');
        await ticketController.completeRegistrationLogic(session.metadata, io);
    }

    res.json({ received: true });
});
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', authAdminRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/staff', staffRoutes);

// ─── Inline routers for missing endpoints ────────────────────────────────────
const { protect } = require('./middleware/authMiddleware');
const authorize = require('./middleware/authorize');
const Registration = require('./models/Registration');
const Admin = require('./models/Admin');

// /api/registrations/:regId/verify  — volunteer/admin marks a ticket verified
const regRouter = express.Router();
regRouter.patch(
    '/:regId/verify',
    protect,
    authorize('volunteer', 'admin', 'superadmin', 'staff'),
    async (req, res) => {
        try {
            const reg = await Registration.findOne({ reg_id: req.params.regId });
            if (!reg) return res.status(404).json({ error: 'Registration not found' });
            reg.verified = true;
            reg.verifiedAt = new Date();
            reg.verifiedBy = req.user.id;
            await reg.save();
            res.status(200).json({ success: true, message: 'Ticket verified', registration: reg });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);
regRouter.patch(
    '/:regId/reject',
    protect,
    authorize('volunteer', 'admin', 'superadmin', 'staff'),
    async (req, res) => {
        try {
            const reg = await Registration.findOne({ reg_id: req.params.regId });
            if (!reg) return res.status(404).json({ error: 'Registration not found' });
            reg.verified = false;
            reg.rejected = true;
            await reg.save();
            res.status(200).json({ success: true, message: 'Ticket rejected' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);
app.use('/api/registrations', regRouter);

// /api/users/volunteers  — returns list of volunteers (for admin activities page)
const usersRouter = express.Router();
usersRouter.get(
    '/volunteers',
    protect,
    authorize('admin', 'superadmin'),
    async (req, res) => {
        try {
            const volunteers = await Admin.find({ role: 'volunteer' }).select('-password');
            res.status(200).json(volunteers);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);
app.use('/api/users', usersRouter);
// ─────────────────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
    res.send("🚀 Campus Event API is running...");
});
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
});

// Export 'io' to use it in your Event Routes
app.set('socketio', io);

// 6. Port Configuration
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`📁 Database Status: ${process.env.MONGO_URI ? "Connected to URI" : "⚠️ MONGO_URI MISSING"}`);
    console.log(`=========================================\n`);
});