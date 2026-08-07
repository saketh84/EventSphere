const mongoose = require('mongoose');
const RegistrationSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    collegeId: { type: String, required: true },
    department: { type: String, default: '' },
    year: { type: String, default: '' },
    phone: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reg_id: { type: String, unique: true },
    isVerified: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    rejected: { type: Boolean, default: false },
    userName: { type: String, default: '' },
    userEmail: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Registration', RegistrationSchema);