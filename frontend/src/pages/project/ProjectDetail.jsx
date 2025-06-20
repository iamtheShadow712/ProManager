import React, { useState } from 'react'
import useProjectStore from '../../store/useProjectStore'
import { format } from 'date-fns'
import { User, Calendar, Info, Heading1, ClipboardList, Pen } from 'lucide-react'
import useThemeStore from '../../store/useThemeStore'
import Description from '../../components/Description'
import { projectStatus } from '../../utils/options'
import { formatDateToInput } from '../../utils/format'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'




const ProjectDetail = () => {
    const { currentProject, updateProject, error } = useProjectStore()
    const { isDarkMode } = useThemeStore()
    const { id } = useParams()
    const [isStatusUpdate, setIsStatusUpdate] = useState(false)
    const [isEndDateUpdate, setIsEndDateUpdate] = useState(false)
    const [updatedEndDate, setUpdatedEndDate] = useState(currentProject.end_date)
    const [updatedStatus, setUpdatedStatus] = useState(currentProject.status)

    if (!currentProject) {
        return <p className="text-center mt-10 text-gray-500">No project selected.</p>
    }

    const statusColorMap = {
        backlog: "bg-gray-200 text-gray-800",
        active: "bg-indigo-200 text-indigo-800",
        completed: "bg-green-200 text-green-800",
        on_hold: "bg-yellow-200 text-yellow-800",
        cancelled: "bg-blue-200 text-blue-800",
        archived: "bg-red-200 text-red-800"
    }

    const {
        id: projectId,
        title,
        description,
        start_date,
        end_date,
        status,
        created_at,
        owner
    } = currentProject

    const handleEndDateChange = (e) => {
        if (e.target.value < start_date) {
            toast("End date cannot be before start date", {
                style: { backgroundColor: "red", color: "white" },
                duration: 1500
            })
            return
        }
        setUpdatedEndDate(new Date(e.target.value).toISOString())
    }

    const handleSave = async () => {
        const payload = {}
        if (updatedEndDate !== end_date) {
            payload.end_date = updatedEndDate
        }
        if (updatedStatus !== status) {
            payload.status = updatedStatus
        }

        if (Object.keys(payload).length === 0) {
            setIsEndDateUpdate(false)
            setIsStatusUpdate(false)
        }

        await updateProject(id, payload)

        if (error) {
            toast(error, {
                style: { backgroundColor: "red", color: "white" },
                duration: 2000
            })
            return
        }
        setIsEndDateUpdate(false)
        setIsStatusUpdate(false)
        toast("Project Created", {
            style: { backgroundColor: "green", color: "white" },
            duration: 1000
        })

    }

    return (
        <div className={`px-4 w-full ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-700">
                    <Heading1 className="text-amber-500 w-6 h-6" />
                    <span className='underline'>{title}</span>
                </h1>
            </div>
            <div className="flex gap-2 items-center text-sm mt-4">
                <ClipboardList className="w-5 h-5" />
                <span>Created on: {format(new Date(created_at), 'MMMM d, yyyy')}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2">
                    <strong className='text-blue-500'>Status:</strong>
                    {
                        isStatusUpdate ? (
                            <>
                                <select
                                    className={`h-8 select w-fit cursor-pointer mt-1 ${isDarkMode ? '' : 'bg-orange-200 text-black placeholder:text-gray-400'}`}
                                    value={updatedStatus}
                                    onChange={(e) => setUpdatedStatus(e.target.value)}
                                >
                                    {projectStatus.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.title}
                                        </option>
                                    ))}
                                </select>
                                <button className='text-xs btn btn-xs bg-green-700' onClick={handleSave}>Save</button>
                            </>
                        ) : (<>

                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusColorMap[status] || 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                                {status.replace('_', ' ').toUpperCase()}
                            </span>
                            <Pen className='h-4 text-red-700 cursor-pointer hover:scale-[105%]' onClick={() => setIsStatusUpdate(true)} />

                        </>)
                    }
                </div>

                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span><strong className='text-blue-500'>Start Date:</strong> <span className='font-bold'>{format(new Date(start_date), 'MMMM d, yyyy')}</span></span>
                </div>

                {end_date && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <span><strong className='text-blue-500'>End Date:</strong></span>
                        {
                            isEndDateUpdate ? (
                                <>
                                    <input
                                        type="date"
                                        name="end_date"
                                        id="end_date"
                                        className={`px-2 input input-bordered w-fit cursor-pointer mt-1 ${isDarkMode ? '' : 'bg-orange-200 border-gray-300 text-black placeholder:text-gray-400'}`}
                                        value={updatedEndDate ? formatDateToInput(updatedEndDate) : ""}
                                        onChange={handleEndDateChange}
                                    />
                                    <button className='text-xs btn btn-xs bg-green-700' onClick={handleSave}>Save</button>
                                </>
                            ) : (<>

                                <span className='font-bold'>{format(new Date(end_date), 'MMMM d, yyyy')}</span>
                                <Pen className='h-4 text-red-700 cursor-pointer hover:scale-[105%]' onClick={() => setIsEndDateUpdate(true)} />

                            </>)
                        }
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-500" />
                    <span className='text-lg font-bold'><span><strong className='text-blue-500'>Owner:</strong>{owner?.full_name}</span></span>
                </div>
            </div>
            <br />
            <hr className={`${isDarkMode ? 'text-gray-800' : 'text-gray-200'}`} />

            <div className="mt-4">
                <Description description={description} projectId={projectId} />
            </div>
        </div>
    )
}

export default ProjectDetail
