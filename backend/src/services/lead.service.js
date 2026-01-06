const Lead = require('../models/lead.model');
const User = require('../models/auth.model');
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
    const { page = 1, limit = 2, search } = query;

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
/**
 * Assign lead to staff (Admin only)
 */
const assignLead = async (leadId, staffId, currentUser) => {
    // Ensure admin
    if (currentUser.role !== 'admin') {
        throw new ApiError(403, 'Access denied');
    }

    // Find lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
        throw new ApiError(404, 'Lead not found');
    }

    // Find staff
    const staff = await User.findOne({ _id: staffId, role: 'staff' });
    if (!staff) {
        throw new ApiError(404, 'Staff not found');
    }

    // Assign lead
    lead.assignedTo = staff._id;
    await lead.save();

    return {
        message: 'Lead assigned successfully',
        leadId: lead._id,
        assignedTo: staff._id,
    };
};

/**
 * Add note to a lead
 * Admin → any lead
 * Staff → only assigned lead
 */
const addNoteToLead = async (leadId, noteText, currentUser) => {
    const lead = await Lead.findById(leadId);

    if (!lead) {
        throw new ApiError(404, 'Lead not found');
    }

    // Staff access check
    if (
        currentUser.role === 'staff' &&
        (!lead.assignedTo || lead.assignedTo.toString() !== currentUser.id)
    ) {
        throw new ApiError(403, 'You are not allowed to add notes to this lead');
    }

    // Add note
    lead.notes.push({
        text: noteText,
        createdBy: currentUser.id,
    });

    await lead.save();

    return {
        message: 'Note added successfully',
        notes: lead.notes,
    };
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    assignLead,
    addNoteToLead,
};
