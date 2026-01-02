const asyncHandler = require('express-async-handler');
const leadService = require('../services/lead.service');

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private (Admin only)
const createLead = asyncHandler(async (req, res) => {
    const lead = await leadService.createLead(req.body, req.user._id);
    res.status(201).json(lead);
});

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private (Admin: All, Staff: Assigned)
const getLeads = asyncHandler(async (req, res) => {
    const result = await leadService.getLeads(req.query, req.user);
    res.json(result);
});

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = asyncHandler(async (req, res) => {
    const lead = await leadService.getLeadById(req.params.id, req.user);
    res.json(lead);
});

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private (Admin / Assigned Staff)
const updateLead = asyncHandler(async (req, res) => {
    const lead = await leadService.updateLead(
        req.params.id,
        req.body,
        req.user
    );
    res.json(lead);
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin / Assigned Staff)
const deleteLead = asyncHandler(async (req, res) => {
    const result = await leadService.deleteLead(req.params.id, req.user);
    res.json(result);
});

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
};
