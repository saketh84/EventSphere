const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'volunteer', 'staff'],
        required: true,
    },
    organizationName: { type: String, default: '' },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    secretKeyVerified: { type: Boolean, default: false },
    staffId: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    isFirstLogin: { type: Boolean, default: true },
    assignedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
}, { timestamps: true });
adminSchema.index({ email: 1, role: 1 }, { unique: true });
module.exports = mongoose.model('Admin', adminSchema);
