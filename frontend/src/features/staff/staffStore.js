import { create } from 'zustand';
import api from '../../lib/axios';

const useStaffStore = create((set) => ({
    staff: [],
    isLoading: false,
    error: null,

    fetchStaff: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/staff');
            set({ staff: response.data, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch staff',
                isLoading: false
            });
        }
    },

    createStaff: async (staffData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/staff', staffData);
            set((state) => ({
                staff: [response.data, ...state.staff],
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to create staff',
                isLoading: false
            });
            throw error;
        }
    },

    updateStaff: async (id, updateData) => {
        console.log(":id", id)
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/staff/${id}`, updateData);
            set((state) => ({
                staff: state.staff.map(s => s._id === id ? response.data : s),
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to update staff',
                isLoading: false
            });
            throw error;
        }
    },

    deleteStaff: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/staff/${id}`);
            set((state) => ({
                staff: state.staff.filter(s => s._id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to delete staff',
                isLoading: false
            });
            throw error;
        }
    }
}));

export default useStaffStore;
