const User = require('../models/auth.model');
const ApiError = require('../utils/ApiError');

/**
 * Create staff (Admin only)
 */
const createStaff = async ({ name, email, password }) => {
    const exists = await User.findOne({ email });
    if (exists) {
        throw new ApiError(409, 'Staff already exists');
    }

    const staff = await User.create({
        name,
        email,
        password,
        role: 'staff',
    });

    if (!staff) {
        throw new ApiError(400, 'Invalid staff data');
    }

    return {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        createdAt: staff.createdAt,
    };
};

/**
 * Get all staff (Admin only)
 */
const getAllStaff = async (query) => {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const filter = { role: 'staff' };

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    const staff = await User.find(filter)
        .select('_id name email role createdAt updatedAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await User.countDocuments(filter);

    return {
        staff,
        page: Number(page),
        pages: Math.ceil(total / limit),
        total,
    };
};

/**
 * Get staff by ID (Admin only)
 */
const getStaffById = async (id) => {
    const staff = await User.findOne({ _id: id, role: 'staff' }).select(
        '_id name email role createdAt password'
    );

    if (!staff) {
        throw new ApiError(404, 'Staff not found');
    }

    return staff;
};

/**
 * Update staff (Admin only)
 */
const updateStaff = async (id, data) => {
    const staff = await User.findOne({ _id: id, role: 'staff' });

    if (!staff) {
        throw new ApiError(404, 'Staff not found');
    }

    staff.name = data.name || staff.name;
    staff.email = data.email || staff.email;

    if (data.password) {
        staff.password = data.password; // hashed by pre-save hook
    }

    await staff.save();

    return {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        updatedAt: staff.updatedAt,
    };
};

/**
 * Delete staff (Admin only)
 */
const deleteStaff = async (id) => {
    const staff = await User.findOne({ _id: id, role: 'staff' });

    if (!staff) {
        throw new ApiError(404, 'Staff not found');
    }

    await staff.deleteOne();

    return { message: 'Staff deleted successfully' };
};

module.exports = {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
};
