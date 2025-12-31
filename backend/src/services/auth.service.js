const User = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: '30d',
    });
};

// Register Service
const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role, // In a real app, you might want to restrict role creation
    });

    if (user) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('Invalid user data');
    }
};

// Login Service
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('Invalid email or password');
    }
};

// Get All Staff
const getAllStaff = async () => {
    return await User.find({ role: 'staff' }).select('_id name email');
};

module.exports = {
    registerUser,
    loginUser,
    getAllStaff,
};
