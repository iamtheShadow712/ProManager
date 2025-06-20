import { X } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Profile from './Profile';
import useThemeStore from '../../store/useThemeStore';
import CreateProjectModal from './CreateProjectModal';
import CreateTaskModal from './CreateTaskModal';
import Task from './Task';

const Modal = () => {
    const { isOpen, closeModal, modalType } = useAppStore()
    const { isDarkMode } = useThemeStore()

    if (!isOpen) return null

    const onClose = () => {
        closeModal()
    }

    let children
    switch (modalType) {
        case "profile":
            children = <Profile />
            break;
        case "create_project":
            children = <CreateProjectModal />
            break;
        case "create_task":
            children = <CreateTaskModal />
            break;
        case "task":
            children = <Task />
            break
    }

    return (
        <div className="fixed inset-0 z-50 flex pt-30 justify-center bg-gray-900/10 backdrop-blur-sm">
            <div className={` w-full h-fit max-w-2xl p-6 rounded-2xl shadow-xl relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-700 bg-orange-500 rounded-full p-1 cursor-pointer"
                >
                    <X className="h-4 w-4" />
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal