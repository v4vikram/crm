const User = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/ApiError');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: '30d',
    });
};

// REGISTER USER
const registerUser = async (userData) => {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }

    // Create user with safe default role
    const user = await User.create({
        name,
        email,
        password,
        role: 'staff', // ✅ Prevent role abuse
    });

    if (!user) {
        throw new ApiError(400, 'Invalid user data');
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    };
};

// LOGIN USER
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password');
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    };
};


module.exports = {
    registerUser,
    loginUser,
};
