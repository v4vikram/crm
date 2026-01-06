import React, { useEffect, useState } from 'react';
import useLeadStore from '../features/leads/leadStore';
import useAuthStore from '../features/auth/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, Trash2, Edit, Search, Eye, Send } from 'lucide-react';
import toast from 'react-hot-toast';

import { LeadSchema } from '../lib/validation';
import useStaffStore from '../features/staff/staffStore';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import DynamicFormModal from '../components/DynamicFormModal';
import DynamicViewModal from '../components/DynamicViewModal';

const Leads = () => {
    const { leads, fetchLeads, isLoading, deleteLead, createLead, updateLead, page, totalPages, addNote } = useLeadStore();
    const { staff, fetchStaff } = useStaffStore();
    const { user } = useAuthStore();
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewingId, setViewingId] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [modalInitialValues, setModalInitialValues] = useState(null);

    const viewingLead = leads.find(l => l._id === viewingId);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchLeads({ search, page: newPage });
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        try {
            await addNote(viewingId, newNote);
            setNewNote('');
            toast.success('Note added');
        } catch (error) {
            toast.error('Failed to add note');
        }
    };

    useEffect(() => {
        fetchLeads({ search });
    }, [fetchLeads, search]);

    useEffect(() => {
        if (user.role === 'admin') {
            fetchStaff();
        }
    }, [user.role]);



    const handleFormSubmit = async (values, { resetForm }) => {
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
    };

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
        setModalInitialValues({
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
        setModalInitialValues({
            name: '',
            email: '',
            phone: '',
            status: 'New',
            assignedTo: ''
        });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const columns = [
        {
            header: 'Name',
            render: (lead) => <div className="text-sm font-medium text-gray-900">{lead.name}</div>
        },
        {
            header: 'Contact',
            render: (lead) => (
                <>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                    <div className="text-sm text-gray-500">{lead.phone}</div>
                </>
            )
        },
        {
            header: 'Status',
            render: (lead) => (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                    ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'Closed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {lead.status}
                </span>
            )
        },
        {
            header: 'Assigned To',
            render: (lead) => (
                <div className="text-sm text-gray-500">
                    {lead.assignedTo?.name || 'Unassigned'}
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            headerClassName: 'text-right',
            render: (lead) => (
                <div className="flex justify-end">
                    <button onClick={() => setViewingId(lead._id)} className="text-gray-600 hover:text-gray-900 mr-4">
                        <Eye className="h-4 w-4" />
                    </button>
                    {user.role === 'admin' && (
                        <>
                            <button onClick={() => openEdit(lead)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    // Form Configuration
    const formFields = [
        { name: 'name', label: 'Name', placeholder: 'Name' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
        { name: 'phone', label: 'Phone', placeholder: 'Phone' },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'New', label: 'New' },
                { value: 'Contacted', label: 'Contacted' },
                { value: 'Qualified', label: 'Qualified' },
                { value: 'Lost', label: 'Lost' },
                { value: 'Closed', label: 'Closed' }
            ]
        }
    ];

    if (user.role === 'admin') {
        formFields.push({
            name: 'assignedTo',
            label: 'Assign To Staff',
            type: 'select',
            options: [
                { value: '', label: 'Unassigned' },
                ...staff.map(s => ({ value: s._id, label: s.name }))
            ]
        });
    }

    // View Modal Configuration
    const viewConfig = [
        { label: 'Email', key: 'email' },
        { label: 'Contact', key: 'phone' },
        {
            label: 'Status',
            render: (lead) => (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                    ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'Closed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {lead.status}
                </span>
            )
        },
        {
            label: 'Assigned To',
            render: (lead) => lead.assignedTo?.name || 'Unassigned'
        },
        {
            label: 'Created At',
            render: (lead) => new Date(lead.createdAt).toLocaleDateString()
        }
    ];

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
                <SearchBar search={search} setSearch={setSearch} />
            </div>

            <Table
                columns={columns}
                data={leads}
                isLoading={isLoading}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: handlePageChange
                }}
                emptyMessage="No leads found"
            />

            {/* View Details Modal */}
            <DynamicViewModal
                isOpen={!!viewingId}
                onClose={() => setViewingId(null)}
                title={viewingLead?.name || 'Lead Details'}
                data={viewingLead}
                columns={viewConfig}
            >
                {viewingLead && (
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                            {viewingLead.notes?.map((note, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-900">{note.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(note.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                            {(!viewingLead.notes || viewingLead.notes.length === 0) && (
                                <p className="text-sm text-gray-500 italic">No notes yet.</p>
                            )}
                        </div>

                        <form onSubmit={handleAddNote} className="flex gap-2">
                            <Input
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a note..."
                                className="flex-1"
                            />
                            <Button type="submit">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                )}
            </DynamicViewModal>

            {/* Formik Modal */}
            {isModalOpen && (
                <DynamicFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingId ? 'Edit Lead' : 'New Lead'}
                    initialValues={modalInitialValues}
                    validationSchema={LeadSchema}
                    onSubmit={handleFormSubmit}
                    fields={formFields}
                    isEdit={!!editingId}
                />
            )}
        </div>
    );
};

export default Leads;
