import { create } from "zustand";

const useAppStore = create((set, get) => ({
    isOpen: false,
    modalType: null,
    isCardMenuOpen: false,
    cardMenuPosition: null,
    task: null,
    toggleCardMenuOpen: (value, position, task = null) => set({ isOpenCardMenu: value, cardMenuPosition: position, task: task }),
    openModal: (type) => set({ isOpen: true, modalType: type }),
    closeModal: () => set({ isOpen: false })
}))

export default useAppStore