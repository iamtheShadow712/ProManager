import React, { useEffect, useRef } from 'react'
import useAppStore from '../../store/useAppStore'
import useThemeStore from '../../store/useThemeStore'
import useProjectStore from '../../store/useProjectStore'
import toast from 'react-hot-toast'

const CardMenu = () => {
    const { isCardMenuOpen, toggleCardMenuOpen, cardMenuPosition, task } = useAppStore()
    const { isDarkMode } = useThemeStore()
    const { updateTask, currentProject, error } = useProjectStore()
    const menuRef = useRef(null)

    if (!isCardMenuOpen && !cardMenuPosition) return null

    const handleMoveClick = async () => {
        const updated_status = task.status === "backlog" ? "todo" : "backlog"
        await updateTask(currentProject.id, task.id, { status: updated_status })
        if (error) {
            toast(error, {
                style: { backgroundColor: "red", color: "white" },
                duration: 2000
            })
            return
        }
        const message = task.status === "backlog" ? "Moved to Board" : "Moved to Backlog"
        toast(message, {
            style: { backgroundColor: "green", color: "white" },
            duration: 1000
        })
        toggleCardMenuOpen(false, null, null)
    }

    const options = [
        { label: `Move to ${task.status === "backlog" ? 'Board' : 'Backlog'}`, onClick: handleMoveClick }
    ]

    return (
        <div
            className={`absolute rounded-xl z-20 ${isDarkMode ? 'bg-white text-black' : 'bg-white'}`}
            style={{ left: `${cardMenuPosition.left}px`, top: `${cardMenuPosition.top}px` }}
            ref={menuRef}
        >
            <ul className={`shadow-lg rounded-md py-2 w-40 text-sm `}>
                {
                    options.map(option => (
                        <li className={`px-4 py-2 hover:bg-gray-200 cursor-pointer`} key={option.label} onClick={option.onClick}>{option.label}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default CardMenu