import React, { useState } from 'react'
import useAppStore from '../../store/useAppStore';
import useThemeStore from '../../store/useThemeStore';
import useProjectStore from '../../store/useProjectStore';
import toast from 'react-hot-toast';
import { projectStatus } from '../../utils/options'
import { convertTextToHTML, formatDateToInput } from '../../utils/format'

const CreateProjectModal = () => {
    const { closeModal } = useAppStore()
    const { isDarkMode } = useThemeStore()
    const { createProject, error, isLoading } = useProjectStore()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "backlog",
        start_date: "",
        end_date: "",
    });



    const handleChange = (e) => {
        if (e.target.name === "end_date" && formData.start_date !== "") {
            if (new Date(formData.start_date) > new Date(e.target.value)) {
                toast("End date cannot be before start date", {
                    style: { backgroundColor: "red", color: "white" },
                    duration: 1500
                })
                return
            }
        }
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim() || !formData.start_date || !formData.end_date) {
            toast("All Fields are required", {
                style: { backgroundColor: "red", color: "white" },
                duration: 1500
            })
            return
        }
        formData.description = convertTextToHTML(formData.description)
        formData.start_date = new Date(formData.start_date).toISOString()
        formData.end_date = new Date(formData.end_date).toISOString()

        await createProject(formData)
        if (error) {
            toast(error, {
                style: { backgroundColor: "red", color: "white" },
                duration: 2000
            })
            return
        }
        toast("Project Created", {
            style: { backgroundColor: "green", color: "white" },
            duration: 1000
        })
        closeModal()
    };

    return (
        <>
            <div>
                <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl font-semibold text-purple-700 text-center">Create New Project</h3>
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
                                placeholder="Enter project title"
                                className={`px-2 input input-bordered w-full mt-1 ${isDarkMode ? '' : 'bg-gray-300 border-gray-300 text-black placeholder:text-gray-400'}`}
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
                                placeholder="Enter project description"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className={`textarea textarea-bordered w-full mt-1 px-3 py-2 rounded-md resize-y max-h-[168px] focus:outline-none focus:ring-2 focus:ring-primary transition ${isDarkMode ? '' : 'bg-gray-300 border-gray-300 text-black placeholder:text-gray-400'
                                    }`}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-500">
                                Status
                            </label>
                            <select
                                name="status"
                                id="status"
                                className={`px-2 select w-full mt-1 ${isDarkMode ? '' : 'bg-gray-300 border-gray-300 text-black placeholder:text-gray-400'}`}
                                value={formData.status}
                                onChange={handleChange}
                            >
                                {projectStatus.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Start and End Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-500">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    id="start_date"
                                    className={`px-2 input input-bordered w-full cursor-pointer mt-1 ${isDarkMode ? '' : 'bg-gray-300 border-gray-300 text-black placeholder:text-gray-400'}`}
                                    required
                                    value={formData.start_date ? formatDateToInput(formData.start_date) : ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-500">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    id="end_date"
                                    className={`px-2 input input-bordered w-full cursor-pointer mt-1 ${isDarkMode ? '' : 'bg-gray-300 border-gray-300 text-black placeholder:text-gray-400'}`}
                                    value={formData.end_date ? formatDateToInput(formData.end_date) : ""}
                                    onChange={handleChange}
                                />
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

export default CreateProjectModal