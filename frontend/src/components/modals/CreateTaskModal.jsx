import React, { useState } from 'react'
import useAppStore from '../../store/useAppStore';
import useThemeStore from '../../store/useThemeStore';
import useProjectStore from '../../store/useProjectStore';
import toast from 'react-hot-toast';
import { taskStatus, priorityStatus } from '../../utils/options';

const CreateTaskModal = () => {
    const { closeModal } = useAppStore()
    const { isDarkMode } = useThemeStore()
    const { createTask, error, isLoading, currentProject } = useProjectStore()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "backlog",
        priority: "low"
    });


    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) {
            toast("All Fields are required", {
                style: { backgroundColor: "red", color: "white" },
                duration: 1500
            })
            return
        }

        await createTask(formData, currentProject.id)
        if (error) {
            toast(error, {
                style: { backgroundColor: "red", color: "white" },
                duration: 2000
            })
            return
        }
        toast("Task Created", {
            style: { backgroundColor: "green", color: "white" },
            duration: 1000
        })
        closeModal()
    };

    return (
        <>
            <div>
                <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl font-semibold text-purple-700 text-center">Create New Task</h3>
                    <hr className='text-gray-200' />
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-500">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Enter Task title"
                                className={`px-2 input input-bordered w-full mt-1 ${isDarkMode ? '' : 'bg-gray-600 text-white placeholder:text-gray-400'}`}
                                required
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-500">
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                placeholder="Enter Task description"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className={`textarea textarea-bordered w-full mt-1 px-3 py-2 rounded-md resize-y max-h-[168px] focus:outline-none focus:ring-2 focus:ring-primary transition ${isDarkMode ? '' : 'bg-gray-600 text-white placeholder:text-gray-400'
                                    }`}
                            />
                        </div>

                        <div className='flex gap-2'>
                            {/* Status */}
                            <div className='flex-1'>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-500">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    id="status"
                                    className={`px-2 select w-full mt-1 ${isDarkMode ? '' : 'bg-gray-600 text-white placeholder:text-gray-400'}`}
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    {taskStatus.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div className='flex-1'>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-500">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    id="priority"
                                    className={`px-2 select w-full mt-1 ${isDarkMode ? '' : 'bg-gray-600 text-white placeholder:text-gray-400'}`}
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    {priorityStatus.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3 pt-4">
                            <button type="submit" className="btn btn-primary flex-1">
                                Create
                            </button>
                            <button type="button" onClick={closeModal} className="btn btn-error text-white flex-1">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateTaskModal