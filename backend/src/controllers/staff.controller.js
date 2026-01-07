const asyncHandler = require('express-async-handler');
const staffService = require('../services/staff.service');

/**
 * @desc    Create staff
 * @route   POST /api/staff
 * @access  Admin
 */
const createStaff = asyncHandler(async (req, res) => {
    const staff = await staffService.createStaff(req.body);
    res.status(201).json(staff);
});

/**
 * @desc    Get all staff
 * @route   GET /api/staff
 * @access  Admin
 */
const getAllStaff = asyncHandler(async (req, res) => {
    const staff = await staffService.getAllStaff(req.query);
    res.json(staff);
});

/**
 * @desc    Get staff by ID
 * @route   GET /api/staff/:id
 * @access  Admin
 */
const getStaffById = asyncHandler(async (req, res) => {
    const staff = await staffService.getStaffById(req.params.id);
    res.json(staff);
});

/**
 * @desc    Update staff
 * @route   PUT /api/staff/:id
 * @access  Admin
 */
const updateStaff = asyncHandler(async (req, res) => {
    const staff = await staffService.updateStaff(req.params.id, req.body);
    res.json(staff);
});

/**
 * @desc    Delete staff
 * @route   DELETE /api/staff/:id
 * @access  Admin
 */
const deleteStaff = asyncHandler(async (req, res) => {
    const result = await staffService.deleteStaff(req.params.id);
    res.json(result);
});

module.exports = {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
};
