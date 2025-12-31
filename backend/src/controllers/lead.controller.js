const leadService = require('../services/lead.service');

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private (Admin only)
const createLead = async (req, res, next) => {
    try {
        const lead = await leadService.createLead(req.body, req.user._id);
        res.status(201).json(lead);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private (Admin: All, Staff: Assigned)
const getLeads = async (req, res, next) => {
    try {
        const result = await leadService.getLeads(req.query, req.user);
        res.json(result);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res, next) => {
    try {
        const lead = await leadService.getLeadById(req.params.id, req.user);
        res.json(lead);
    } catch (error) {
        res.status(404);
        next(error);
    }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private (Admin only)
const updateLead = async (req, res, next) => {
    try {
        const lead = await leadService.updateLead(req.params.id, req.body);
        res.json(lead);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin only)
const deleteLead = async (req, res, next) => {
    try {
        const result = await leadService.deleteLead(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404);
        next(error);
    }
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
};
