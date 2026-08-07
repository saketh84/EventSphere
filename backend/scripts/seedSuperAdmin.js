require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.env.SUPERADMIN_EMAIL || 'owner@eventsphere.com';
    const existing = await Admin.findOne({ email, role: 'superadmin' });
    if (existing) {
        console.log('Super admin already exists:', email);
        process.exit(0);
    }
    const hashed = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD || 'Owner@123', 12);
    await Admin.create({
        name: process.env.SUPERADMIN_NAME || 'Platform Owner',
        email,
        password: hashed,
        role: 'superadmin',
        secretKeyVerified: true,
        isFirstLogin: false,
    });
    console.log('Super admin seeded:', email);
    process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
