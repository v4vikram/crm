const authService = require('../services/auth.service');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400); // Bad Request
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);
        res.json(user);
    } catch (error) {
        res.status(401); // Unauthorized
        next(error);
    }
};

// @desc    Get all staff
// @route   GET /api/auth/staff
// @access  Private (Admin only)
const getStaff = async (req, res, next) => {
    try {
        const staff = await authService.getAllStaff();
        res.json(staff);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

module.exports = {
    register,
    login,
    getStaff,
};
