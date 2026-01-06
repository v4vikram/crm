const User = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/ApiError');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: '30d',
    });
};

// REGISTER USER
const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'staff',
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token: generateToken(user._id),
    };
};

// LOGIN USER
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token: generateToken(user._id),
    };
};

// GET CURRENT USER (for /me)
const getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select('-password');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
};
