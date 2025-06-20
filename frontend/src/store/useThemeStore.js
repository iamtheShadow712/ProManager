import { create } from "zustand";
import { persist } from 'zustand/middleware'

const useThemeStore = create(persist((set, get) => ({
    isDarkMode: false,
    toggleTheme: () => set({ isDarkMode: !get().isDarkMode })
}), {
    name: "theme"
}))


export default useThemeStore