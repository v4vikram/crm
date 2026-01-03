const asyncHandler = require('express-async-handler');
const authService = require('../services/auth.service');

// @desc Register user
// @route POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
});

// @desc Login user
// @route POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    res.json(user);
});

module.exports = { register, login };
