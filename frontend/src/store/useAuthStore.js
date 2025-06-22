import { create } from "zustand";
import { persist } from 'zustand/middleware'
import axiosHandler from "../utils/axios";

const useAuthStore = create(persist((set) => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null,
    register: async (payload) => {
        set({ isLoading: true, error: null })
        try {
            await axiosHandler.post('/auth/register', payload)

            set({ isLoading: false, error: null })
        } catch (error) {
            set({ isLoading: false, error: error.message || "Network Error" })
        }
    },
    login: async (payload) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axiosHandler.post('/auth/login', payload)

            localStorage.setItem("token", res.data.token.access_token)
            set({ isLoading: false, user: res.data.user, isAuthenticated: true, error: null })
        } catch (error) {
            set({ isLoading: false, error: error.message || "Network Error" })
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null })
        try {
            await axiosHandler.post('/auth/logout')
            localStorage.removeItem("token")
            set({ isLoading: false, user: null, isAuthenticated: false, error: null })
        } catch (error) {
            set({ isLoading: false, error: error.message || "Network Error" })
        }
    }
}), {
    name: "auth",
    // partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
}))

export default useAuthStore