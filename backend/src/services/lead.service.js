const Lead = require('../models/lead.model');
const ApiError = require('../utils/ApiError');

// CREATE LEAD
const createLead = async (leadData, userId) => {
    const lead = await Lead.create({
        ...leadData,
        createdBy: userId,
    });

    if (!lead) {
        throw new ApiError(400, 'Failed to create lead');
    }

    return lead;
};

// GET ALL LEADS (Pagination + Search + Role-based)
const getLeads = async (query, user) => {
    const { page = 1, limit = 10, search } = query;

    const skip = (page - 1) * limit;
    const filter = {};

    // Search
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    // Role-based access
    if (user.role === 'staff') {
        filter.assignedTo = user._id;
    }

    const leads = await Lead.find(filter)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Lead.countDocuments(filter);

    return {
        leads,
        page: Number(page),
        pages: Math.ceil(total / limit),
        total,
    };
};

// GET SINGLE LEAD
const getLeadById = async (id, user) => {
    const lead = await Lead.findById(id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name');

    if (!lead) {
        throw new ApiError(404, 'Lead not found');
    }

    // Permission check
    if (
        user.role === 'staff' &&
        lead.assignedTo?.toString() !== user._id.toString()
    ) {
        throw new ApiError(403, 'Not authorized to view this lead');
    }

    return lead;
};

// UPDATE LEAD
const updateLead = async (id, updateData, user) => {
    const lead = await Lead.findById(id);

    if (!lead) {
        throw new ApiError(404, 'Lead not found');
    }

    // Permission check
    if (
        user.role === 'staff' &&
        lead.assignedTo?.toString() !== user._id.toString()
    ) {
        throw new ApiError(403, 'Not authorized to update this lead');
    }

    Object.assign(lead, updateData);
    await lead.save();

    return lead.populate('assignedTo', 'name email');
};

// DELETE LEAD
const deleteLead = async (id, user) => {
    const lead = await Lead.findById(id);

    if (!lead) {
        throw new ApiError(404, 'Lead not found');
    }

    // Permission check
    if (
        user.role === 'staff' &&
        lead.assignedTo?.toString() !== user._id.toString()
    ) {
        throw new ApiError(403, 'Not authorized to delete this lead');
    }

    await lead.deleteOne();

    return { message: 'Lead removed successfully' };
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
};
