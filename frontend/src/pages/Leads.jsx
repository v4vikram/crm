import React, { useEffect, useState } from 'react';
import useLeadStore from '../features/leads/leadStore';
import useAuthStore from '../features/auth/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { useFormik } from 'formik';
import { LeadSchema } from '../lib/validation';

const Leads = () => {
    const { leads, fetchLeads, isLoading, deleteLead, createLead, updateLead } = useLeadStore();
    const { user } = useAuthStore();
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchLeads({ search });
    }, [fetchLeads, search]);

    useEffect(() => {
        if (user.role === 'admin') {
            const fetchStaff = async () => {
                try {
                    const { data } = await api.get('/auth/staff');
                    setStaffList(data);
                } catch (error) {
                    console.error("Failed to fetch staff");
                }
            };
            fetchStaff();
        }
    }, [user.role]);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            status: 'New',
            assignedTo: ''
        },
        validationSchema: LeadSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                // Handle empty assignedTo for staff
                const submitValues = { ...values };
                if (!submitValues.assignedTo) {
                    submitValues.assignedTo = null;
                }

                if (editingId) {
                    await updateLead(editingId, submitValues);
                    toast.success('Lead updated');
                } else {
                    await createLead(submitValues);
                    toast.success('Lead created');
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
        if (window.confirm('Are you sure?')) {
            try {
                await deleteLead(id);
                toast.success('Lead deleted');
            } catch (error) {
                toast.error('Failed to delete lead');
            }
        }
    };

    const openEdit = (lead) => {
        formik.setValues({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            status: lead.status,
            assignedTo: lead.assignedTo?._id || ''
        });
        setEditingId(lead._id);
        setIsModalOpen(true);
    };

    const openNew = () => {
        formik.resetForm();
        setEditingId(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                {user.role === 'admin' && (
                    <Button onClick={openNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lead
                    </Button>
                )}

            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                {user.role === 'admin' && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leads.map((lead) => (
                                <tr key={lead._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{lead.email}</div>
                                        <div className="text-sm text-gray-500">{lead.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                lead.status === 'Closed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {lead.assignedTo?.name || 'Unassigned'}
                                    </td>
                                    {user.role === 'admin' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => openEdit(lead)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:text-red-900">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {leads.length === 0 && <div className="p-4 text-center text-gray-500">No leads found</div>}
                </div>
            )}

            {/* Formik Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-white rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-bold">{editingId ? 'Edit Lead' : 'New Lead'}</h2>
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
                                    name="phone"
                                    placeholder="Phone"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phone}
                                    className={formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
                                )}
                            </div>

                            <div>
                                <select
                                    name="status"
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Lost">Lost</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            {user.role === 'admin' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Assign To Staff</label>
                                    <select
                                        name="assignedTo"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                        value={formik.values.assignedTo}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">Unassigned</option>
                                        {staffList.map(staff => (
                                            <option key={staff._id} value={staff._id}>
                                                {staff.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

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

export default Leads;
