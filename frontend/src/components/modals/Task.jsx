import React, { useEffect, useState } from 'react'
import useProjectStore from '../../store/useProjectStore'
import useAppStore from '../../store/useAppStore'
import { format } from 'date-fns'
import useThemeStore from '../../store/useThemeStore'
import { priorityStatus, taskStatus, taskStatusMap } from '../../utils/options'
import { Pen } from 'lucide-react'
import toast from 'react-hot-toast'

const Task = () => {
    const { currentTask, updateTask, error } = useProjectStore()
    const { isDarkMode } = useThemeStore()
    const [isPriorityEdit, setIsPriorityEdit] = useState(false)
    const [priority, setPriority] = useState(currentTask.priority)

    const [isStatusEdit, setIsStatusEdit] = useState(false)
    const [status, setStatus] = useState(currentTask.status)
    const base = isDarkMode ? 'bg-opacity-30' : 'bg-opacity-80'


    const statusColorMap = {
        backlog: `bg-cyan-500 ${base}`,
        todo: `bg-violet-400 ${base}`,
        in_progress: `bg-yellow-600 ${base}`,
        review: `bg-blue-400 ${base}`,
        demo: `bg-purple-400 ${base}`,
        done: `bg-green-400 ${base}`,
    }

    if (!currentTask) return null

    const handleSave = async () => {
        const payload = {}
        if (priority !== currentTask.priority) {
            payload.priority = priority
        }
        if (status !== currentTask.status) {
            payload.status = status
        }
        if (Object.keys(payload).length === 0) {
            setIsStatusEdit(false)
            setIsPriorityEdit(false)
            return
        }
        await updateTask(currentTask.project_id, currentTask.id, payload)
        if (error) {
            toast(error, {
                style: { backgroundColor: "red", color: "white" },
                duration: 2000
            })
            return
        }

        setIsStatusEdit(false)
        setIsPriorityEdit(false)
        toast("Task Updated", {
            style: { backgroundColor: "green", color: "white" },
            duration: 1000
        })
    }

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                {currentTask.title}
            </h2>

            <p className={`mb-6 whitespace-pre-line leading-relaxed text-sm border-l-4 border-blue-400 pl-4 max-h-[200px] overflow-scroll text-wrap ${isDarkMode ? '' : 'text-gray-600'}`}>
                {currentTask.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="align-middle flex items-center gap-1 mb-1">
                        <span className={` ${isDarkMode ? 'text-orange-100' : ''}`}>Status</span>
                        {
                            !isStatusEdit ?
                                <div className='tooltip' data-tip="Edit">
                                    <Pen className='h-4 text-red-700 cursor-pointer hover:scale-[105%]' onClick={() => setIsStatusEdit(true)} />
                                </div>
                                : <button className='text-xs btn btn-xs bg-green-700' onClick={handleSave}>Save</button>
                        }
                    </div>
                    {
                        isStatusEdit ?
                            <select
                                className={`px-2 select w-fit mt-1 ${isDarkMode ? '' : 'bg-gray-400 text-black placeholder:text-gray-400'}`}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {taskStatus.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.title}
                                    </option>
                                ))}
                            </select> : (
                                <p className="font-semibold capitalize">
                                    <span className={`inline-block px-2 py-1 text-xs text-white rounded ${statusColorMap[currentTask.status]}`}>
                                        {taskStatusMap[currentTask.status]}
                                    </span>
                                </p>
                            )
                    }
                </div>

                <div>
                    <div className="align-middle flex items-center gap-1 mb-1">
                        <span className={` ${isDarkMode ? 'text-orange-100' : ''}`}>Priority</span>
                        {
                            !isPriorityEdit ?
                                <div className='tooltip' data-tip="Edit">
                                    <Pen className='h-4 text-red-700 cursor-pointer hover:scale-[105%]' onClick={() => setIsPriorityEdit(true)} />
                                </div>
                                : <button className='text-xs btn btn-xs bg-green-700' onClick={handleSave}>Save</button>
                        }
                    </div>
                    {
                        isPriorityEdit ?
                            <select
                                name="priority"
                                id="priority"
                                className={`px-2 select w-fit mt-1 ${isDarkMode ? '' : 'bg-gray-400 text-black placeholder:text-gray-400'}`}
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                {priorityStatus.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.title}
                                    </option>
                                ))}
                            </select> : (
                                <p className="font-semibold capitalize">
                                    <span className={`inline-block px-2 py-1 text-xs rounded 
                    ${currentTask.priority === 'high' ? 'bg-red-200 dark:bg-red-700 text-red-700 dark:text-red-100'
                                            : currentTask.priority === 'medium' ? 'bg-yellow-200 dark:bg-yellow-600 text-yellow-700 dark:text-yellow-100'
                                                : 'bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-100'}`}>
                                        {currentTask.priority}
                                    </span>
                                </p>
                            )
                    }
                </div>

                <div>
                    <p className={` ${isDarkMode ? 'text-orange-100' : ''}`}>Created</p>
                    <p className="font-semibold">{format(new Date(currentTask.created_at), 'PPP')}</p>
                </div>

                {currentTask.reporter && (
                    <div className="">
                        <p className={` ${isDarkMode ? 'text-orange-100' : ''}`}>Reporter</p>
                        <p className="font-semibold">{currentTask.reporter.full_name}</p>
                    </div>
                )}
            </div>
        </div>

    )
}

export default Task
