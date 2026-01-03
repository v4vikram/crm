const asyncHandler = require('express-async-handler');
const leadService = require('../services/lead.service');

/**
 * @desc    Create new lead
 * @route   POST /api/leads
 * @access  Private (Admin only)
 */
const createLead = asyncHandler(async (req, res) => {
    const lead = await leadService.createLead(req.body, req.user._id);
    res.status(201).json(lead);
});

/**
 * @desc    Get all leads
 * @route   GET /api/leads
 * @access  Private (Admin: All, Staff: Assigned)
 */
const getLeads = asyncHandler(async (req, res) => {
    const result = await leadService.getLeads(req.query, req.user);
    res.json(result);
});

/**
 * @desc    Get single lead
 * @route   GET /api/leads/:id
 * @access  Private
 */
const getLeadById = asyncHandler(async (req, res) => {
    const lead = await leadService.getLeadById(req.params.id, req.user);
    res.json(lead);
});

/**
 * @desc    Update lead
 * @route   PUT /api/leads/:id
 * @access  Private (Admin / Assigned Staff)
 */
const updateLead = asyncHandler(async (req, res) => {
    const lead = await leadService.updateLead(
        req.params.id,
        req.body,
        req.user
    );
    res.json(lead);
});

/**
 * @desc    Delete lead
 * @route   DELETE /api/leads/:id
 * @access  Private (Admin / Assigned Staff)
 */
const deleteLead = asyncHandler(async (req, res) => {
    const result = await leadService.deleteLead(req.params.id, req.user);
    res.json(result);
});
/**
 * @desc    Assign lead to staff
 * @route   PUT /api/leads/:id/assign
 * @access  Private (Admin only)
 */
const assignLead = asyncHandler(async (req, res) => {
    const result = await leadService.assignLead(
        req.params.id,
        req.body.staffId,
        req.user
    );

    res.json(result);
});

/**
 * @desc    Add note to lead
 * @route   POST /api/leads/:id/notes
 * @access  Private (Admin / Assigned Staff)
 */
const addLeadNote = asyncHandler(async (req, res) => {
    const { text } = req.body;

    if (!text) {
        res.status(400);
        throw new Error('Note text is required');
    }

    const result = await leadService.addNoteToLead(
        req.params.id,
        text,
        req.user
    );

    res.status(201).json(result);
});


module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    assignLead,
    addLeadNote,
};
