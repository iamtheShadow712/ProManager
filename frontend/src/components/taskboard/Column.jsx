import React, { useEffect, useState } from 'react'
import useThemeStore from '../../store/useThemeStore'
import TaskCard from './TaskCard'
import useProjectStore from '../../store/useProjectStore'
import toast from 'react-hot-toast'

const Column = ({ title, status }) => {
    const { isDarkMode } = useThemeStore()
    const { currentProject, updateTask, currentTask, error, isLoading, projectTasks } = useProjectStore()
    const tasks = projectTasks.filter(task => task.status === status)

    const titleColor = {
        Todo: 'text-blue-500',
        'In Progress': 'text-yellow-500',
        Review: 'text-purple-500',
        Demo: 'text-blue-600',
        Done: 'text-green-500',
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleDrop = async (e) => {
        e.preventDefault()
        if (!currentTask) return
        if (currentTask.status === status) return
        await updateTask(currentProject.id, currentTask.id, { status })
        if (error) {
            toast("Error updating status", {
                style: { backgroundColor: "red", color: "white" },
                duration: 2000
            })
            return
        }

        toast("Status Updated", {
            style: { backgroundColor: "green", color: "white" },
            duration: 2000
        })
    }

    // const handleDragEnter = (e) => {
    //     e.preventDefault()
    // }

    return (
        <div className={`w-[250px] min-h-[500px] mt-10 ${isDarkMode ? '' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        // onDragEnter={handleDragEnter}
        >
            <div className={`w-[250px] h-full rounded-lg p-2 ${isDarkMode ? ' bg-gray-800' : 'bg-blue-200'}`}>
                <h1 className={`text-xl text-center font-bold ${titleColor[title] || 'text-gray-500'}`}>
                    {title}
                </h1>
                <hr className={`my-2  ${isDarkMode ? 'text-gray-600' : 'text-gray-200'}`} />
                {
                    tasks && tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))
                }
            </div>
        </div>
    )
}

export default Column

