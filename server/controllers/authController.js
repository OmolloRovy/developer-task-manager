const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Signup endpoint logic
exports.signup = async (req, res) => {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // --- CHANGE THIS LINE ---
    res.status(201).json({ // Use 201 for resource creation, and wrap token in an object
        message: 'User registered successfully', // Optional: add a message
        token, // Shorthand for token: token
        user: { // Optional: send back non-sensitive user data
            id: user._id,
            email: user.email,
            role: user.role
        }
    });
};

//Login endpoint logic
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // --- CHANGE THIS LINE ---
    res.status(200).json({ // Use 200 for successful login, and wrap token in an object
        message: 'Login successful', // Optional: add a message
        token, // Shorthand for token: token
        user: { // Optional: send back non-sensitive user data
            id: user._id,
            email: user.email,
            role: user.role
        }
    });
};