import React, { useEffect } from 'react'
import useProjectStore from '../../store/useProjectStore'
import useThemeStore from '../../store/useThemeStore'
import useAppStore from '../../store/useAppStore'
import { format } from 'date-fns'
import { ClipboardList, Heading1, Info, ScrollText } from 'lucide-react'
import TaskCard from '../../components/taskboard/TaskCard'

const ProjectBacklog = () => {
    const { currentProject, fetchtasksByProjectId, projectTasks, tasksProjectId, hydrated } = useProjectStore()
    const { isDarkMode } = useThemeStore()
    const { openModal } = useAppStore()
    const backlogTasks = projectTasks.filter(task => task.status === "backlog")

    useEffect(() => {
        if (!hydrated) return;

        const fetchTasks = async () => {
            if (currentProject && currentProject.id && tasksProjectId !== currentProject.id) {
                await fetchtasksByProjectId(currentProject.id)
            }
        }

        fetchTasks()
    }, [hydrated, tasksProjectId, currentProject])


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
            <div className='flex items-center mt-5 gap-3'>
                <ScrollText className="w-5 h-5 text-orange-500 mt-1" />
                <h2 className="text-2xl font-semibold text-blue-500">Backlog Tasks</h2>
            </div>
            <div className='grid grid-cols-3 gap-5 mt-5'>
                {
                    backlogTasks ? backlogTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    )) :
                        <h1>No Task in the backlog</h1>
                }
            </div>
        </div>
    )
}

export default ProjectBacklog