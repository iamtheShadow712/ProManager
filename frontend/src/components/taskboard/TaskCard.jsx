import React from 'react'
import { format } from 'date-fns'
import useThemeStore from '../../store/useThemeStore'
import useProjectStore from '../../store/useProjectStore'
import useAppStore from '../../store/useAppStore'


const TaskCard = ({ task }) => {
    const { isDarkMode } = useThemeStore()
    const { toggleCardMenuOpen, openModal } = useAppStore()
    const { setCurrentTask } = useProjectStore()
    const { title, priority, status, created_at, description } = task
    const base = isDarkMode ? 'bg-opacity-30' : 'bg-opacity-80'


    const statusColorMap = {
        backlog: `bg-cyan-500 ${base}`,
        todo: `bg-violet-200 ${base}`,
        in_progress: `bg-yellow-200 ${base}`,
        review: `bg-blue-400 ${base}`,
        demo: `bg-purple-400 ${base}`,
        done: `bg-green-400 ${base}`,
    }

    const handleDragStart = (e) => {
        setCurrentTask(task)
    }

    const handleContextMenu = (e) => {
        e.preventDefault()
        const menuWidth = 300
        const menuHeight = 300

        const left = e.clientX > window.innerWidth - menuWidth
            ? window.innerWidth - menuWidth
            : e.clientX

        const top = e.clientY > window.innerHeight - menuHeight
            ? window.innerHeight - menuHeight
            : e.clientY

        const position = { left, top }
        toggleCardMenuOpen(true, position, task)
    }

    const handleClick = () => {
        setCurrentTask(task)
        openModal("task")
    }


    return (
        <div
            className={`shadow rounded-lg cursor-pointer hover:scale-[103%] p-4 mb-3 border h-[120px] flex flex-col justify-between transition-all ${statusColorMap[status]} ${isDarkMode ? ' border-gray-700 text-gray-100' : ' border-gray-200 text-gray-800'}`}
            draggable
            onDragStart={handleDragStart}
            onContextMenu={handleContextMenu}
            onClick={handleClick}
        >
            <div className={`overflow-hidden text-ellipsis ${status !== "backlog" && 'h-1/2'}`}>
                <h2 className={`text-sm font-semibold mb-2 truncate ${isDarkMode ? 'text-slate-950' : 'text-black'} ${status === "done" ? 'line-through' : ''} `}>{title}</h2>
            </div>
            {
                status === "backlog" && (
                    <h1 className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} >{description}</h1>
                )
            }
            <div className="flex justify-between items-end text-sm text-gray-600 dark:text-gray-300 mt-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full font-medium
    ${priority === 'high' ? 'bg-red-100 text-red-700' :
                        priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'}`}>
                    <span className='text-[10px] uppercase font-bold'>{priority}</span>
                </div>
                <div className="text-xs text-gray-600 font-bold mt-2 text-end">
                    {format(new Date(created_at), 'MMMM d, yyyy')}
                </div>
            </div>

        </div>
    )
}

export default TaskCard