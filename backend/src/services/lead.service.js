const Lead = require('../models/lead.model');

// Create Lead
const createLead = async (leadData, userId) => {
    const lead = await Lead.create({
        ...leadData,
        createdBy: userId,
    });
    return lead;
};

// Get All Leads with Pagination, Search, and Role-based filtering
const getLeads = async (query, user) => {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    let filter = {};

    // Search logic
    if (search) {
        filter = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        };
    }

    // Role-based filtering
    if (user.role === 'staff') {
        filter.assignedTo = user._id; // Staff can only see their own leads
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

// Get Single Lead (with permission check)
const getLeadById = async (id, user) => {
    const lead = await Lead.findById(id).populate('assignedTo', 'name email');

    if (!lead) {
        throw new Error('Lead not found');
    }

    // Check permission
    if (user.role === 'staff' && lead.assignedTo?._id.toString() !== user._id.toString()) {
        throw new Error('Not authorized to view this lead');
    }

    return lead;
};

// Update Lead
const updateLead = async (id, updateData) => {
    const lead = await Lead.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).populate('assignedTo', 'name email');

    if (!lead) {
        throw new Error('Lead not found');
    }

    return lead;
};

// Delete Lead
const deleteLead = async (id) => {
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
        throw new Error('Lead not found');
    }

    return { message: 'Lead removed' };
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
};
