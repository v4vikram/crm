import { create } from 'zustand';
import api from '../../lib/axios';

const useLeadStore = create((set, get) => ({
    leads: [],
    isLoading: false,
    error: null,
    page: 1,
    totalPages: 1,

    fetchLeads: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/leads', { params });
            set({
                leads: response.data.leads || [],
                page: response.data.page,
                totalPages: response.data.pages,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch leads',
                isLoading: false
            });
        }
    },

    createLead: async (leadData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/leads', leadData);
            set((state) => ({
                leads: [response.data, ...state.leads],
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to create lead',
                isLoading: false
            });
            throw error;
        }
    },

    deleteLead: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/leads/${id}`);
            set((state) => ({
                leads: state.leads.filter(l => l._id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to delete lead',
                isLoading: false
            });
            throw error;
        }
    },

    updateLead: async (id, updateData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/leads/${id}`, updateData);
            set((state) => ({
                leads: state.leads.map(l => l._id === id ? response.data : l),
                isLoading: false
            }));
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to update lead',
                isLoading: false
            });
            throw error;
        }
    },

    addNote: async (id, text) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(`/leads/${id}/notes`, { text });
            // Response contains: { message: '...', notes: [...] }
            // We need to update the lead's notes in the local state
            set((state) => ({
                leads: state.leads.map(l =>
                    l._id === id ? { ...l, notes: response.data.notes } : l
                ),
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to add note',
                isLoading: false
            });
            throw error;
        }
    }
}));

export default useLeadStore;
