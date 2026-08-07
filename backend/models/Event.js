const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, default: 0 },
    category: {
        type: String,
        enum: ['Technical', 'Cultural', 'Sports', 'General'],
        default: 'General'
    },
    image: { type: String },
    imagePublicId: { type: String },
    organizer: { type: String, default: 'Event Team' },
    description: { type: String, default: '' },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    capacity: { type: Number },
    assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
