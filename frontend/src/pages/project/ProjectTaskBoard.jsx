import React, { useEffect, useState } from 'react'
import Column from '../../components/taskboard/Column'
import useProjectStore from '../../store/useProjectStore'
import useThemeStore from '../../store/useThemeStore'
import { ClipboardList, Heading1 } from 'lucide-react'
import { format } from 'date-fns'
import useAppStore from '../../store/useAppStore'



const ProjectTaskBoard = () => {
    const { currentProject, fetchtasksByProjectId, tasksProjectId, hydrated } = useProjectStore()
    const { isDarkMode } = useThemeStore()
    const { openModal } = useAppStore()


    useEffect(() => {
        if (!hydrated) return;

        const fetchTasks = async () => {
            if (currentProject && currentProject.id && tasksProjectId !== currentProject.id) {
                await fetchtasksByProjectId(currentProject.id)
            }
        }

        fetchTasks()
    }, [hydrated, tasksProjectId, currentProject])


    const taskColumns = [
        { label: "Todo", status: 'todo' },
        { label: "In Progress", status: 'in_progress' },
        { label: "Review", status: 'review' },
        { label: "Demo", status: 'demo' },
        { label: "Done", status: 'done' },
    ]
    return (
        <div className={`px-4 w-full ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-700">
                    <Heading1 className="text-amber-500 w-6 h-6" />
                    <span className='underline'>{currentProject.title}</span>
                </h1>
                <button className='btn btn-primary' onClick={() => openModal("create_task")}>Add Task</button>
            </div>
            <div className="flex gap-2 items-center text-sm mt-4">
                <ClipboardList className="w-5 h-5" />
                <span>Created on: {format(new Date(currentProject.created_at), 'MMMM d, yyyy')}</span>
            </div>

            <div className='flex flex-wrap justify-around gap-4 mb-20 mx-auto'>
                {
                    taskColumns.map(task => (
                        <Column key={task.label} title={task.label} status={task.status} />
                    ))
                }
            </div>
        </div>
    )
}

export default ProjectTaskBoard

