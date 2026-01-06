import React, { useEffect, useState } from 'react';
import useAuthStore from '../features/auth/authStore';
import useStaffStore from '../features/staff/staffStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, Trash2, Edit, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { StaffSchema } from '../lib/validation';
import { Navigate } from 'react-router-dom';
import Table from '../components/Table';

const Staff = () => {
    const { user } = useAuthStore();
    const { staff, fetchStaff, isLoading, deleteStaff, createStaff, updateStaff } = useStaffStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Protect route - Admin only
    if (user && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            isEditing: false
        },
        validationSchema: StaffSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const submitValues = { ...values };
                if (submitValues.isEditing && !submitValues.password) {
                    delete submitValues.password; // Don't send empty password on update
                }
                // Remove helper field
                delete submitValues.isEditing;

                if (editingId) {
                    await updateStaff(editingId, submitValues);
                    toast.success('Staff member updated');
                } else {
                    await createStaff(submitValues);
                    toast.success('Staff member created');
                }
                setIsModalOpen(false);
                resetForm();
                setEditingId(null);
            } catch (error) {
                toast.error(editingId ? 'Failed to update' : 'Failed to create');
            }
        },
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This action cannot be undone.')) {
            try {
                await deleteStaff(id);
                toast.success('Staff member deleted');
            } catch (error) {
                toast.error('Failed to delete staff');
            }
        }
    };

    const openEdit = (staffMember) => {
        formik.setValues({
            name: staffMember.name,
            email: staffMember.email,
            password: '',
            isEditing: true
        });
        setEditingId(staffMember._id);
        setIsModalOpen(true);
    };

    const openNew = () => {
        formik.resetForm({
            values: {
                name: '',
                email: '',
                password: '',
                isEditing: false
            }
        });
        setEditingId(null);
        setIsModalOpen(true);
    };


    // Client-side pagination for staff
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Reset to page 1 when staff list changes (e.g. search/filter if added later)
    useEffect(() => {
        setCurrentPage(1);
    }, [staff.length]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStaff = staff.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(staff.length / itemsPerPage);

    const columns = [
        {
            header: 'Name',
            render: (staffMember) => <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
        },
        {
            header: 'Email',
            render: (staffMember) => <div className="text-sm text-gray-500">{staffMember.email}</div>
        },
        {
            header: 'Role',
            render: (staffMember) => (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                    {staffMember.role}
                </span>
            )
        },
        {
            header: 'Joined',
            render: (staffMember) => (
                <div className="text-sm text-gray-500">
                    {new Date(staffMember.createdAt).toLocaleDateString()}
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            headerClassName: 'text-right',
            render: (staffMember) => (
                <div className="flex justify-end">
                    <button onClick={() => openEdit(staffMember)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(staffMember._id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <UserCog className="h-8 w-8 text-primary-600" />
                    Staff Management
                </h1>
                <Button onClick={openNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Staff
                </Button>
            </div>

            <Table
                columns={columns}
                data={currentStaff}
                isLoading={isLoading}
                pagination={staff.length > itemsPerPage ? {
                    currentPage: currentPage,
                    totalPages: totalPages,
                    onPageChange: setCurrentPage
                } : null}
                emptyMessage="No staff members found"
            />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-white rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-bold">{editingId ? 'Edit Staff' : 'New Staff'}</h2>
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    name="name"
                                    placeholder="Name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                                )}
                            </div>

                            <div>
                                <Input
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                                )}
                            </div>

                            <div>
                                <Input
                                    name="password"
                                    placeholder={editingId ? "New Password (optional)" : "Password"}
                                    type="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit" isLoading={formik.isSubmitting}>{editingId ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
