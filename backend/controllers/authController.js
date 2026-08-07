const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        const { name, email, password, collegeId } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check existing user
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ error: "An account with this email already exists" });
        }

        // Create user — password is hashed by the pre-save hook in User model
        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password,
            role: 'student',
            collegeId: collegeId || null,
        });

        // Generate JWT — include role so middleware can do role-based access
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            }
        });

    } catch (err) {
        console.error('Signup error:', err);
        // MongoDB duplicate key error (email unique constraint)
        if (err.code === 11000) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }
        return res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        if (!email || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        console.log("======================");
        console.log("Email:", email);
        console.log("User:", user);

        if (!user) {

            console.log("User NOT FOUND");

            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        console.log("Stored Password:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {

            console.log("Password Incorrect");

            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'student'
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
};
