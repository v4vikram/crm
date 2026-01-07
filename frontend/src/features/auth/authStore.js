import { create } from "zustand";
import api from "../../lib/axios";

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // ✅ IMPORTANT
    error: null,

    // 🔐 LOGIN
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post("/auth/login", { email, password });
            set({
                user: res.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Login failed",
                isLoading: false,
            });
            throw error;
        }
    },

    // 📝 REGISTER
    register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post("/auth/register", { name, email, password });
            set({
                user: res.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Registration failed",
                isLoading: false,
            });
            throw error;
        }
    },

    // 🚪 LOGOUT
    logout: async () => {
        await api.post("/auth/logout");
        set({
            user: null,
            isAuthenticated: false,
        });
    },

    // 🔁 CHECK AUTH (ON REFRESH)
    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get("/auth/me");
            set({
                user: res.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },
}));

export default useAuthStore;