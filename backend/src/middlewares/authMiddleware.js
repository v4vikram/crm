const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/auth.model');

const protect = async (req, res, next) => {
    try {
        // 🔐 Read token from HTTP-only cookie
        const token = req.cookies?.access_token;

        if (!token) {
            res.status(401);
            throw new Error('Not authorized, no token');
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Attach user to request
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.status(401);
            throw new Error('User not found');
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
};


const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, adminOnly };