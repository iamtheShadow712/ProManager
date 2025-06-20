import React from 'react'
import useThemeStore from '../store/useThemeStore'
import { useNavigate } from 'react-router-dom'

const ProjectCard = ({ project }) => {
    const { isDarkMode } = useThemeStore()
    const navigate = useNavigate()
    const statusColorMap = {
        backlog: "bg-gray-200 text-gray-800",
        active: "bg-indigo-200 text-indigo-800",
        completed: "bg-green-200 text-green-800",
        on_hold: "bg-yellow-200 text-yellow-800",
        cancelled: "bg-blue-200 text-blue-800",
        archived: "bg-red-200 text-red-800"
    }
    const handleClick = () => {
        navigate(`/projects/${project.id}`)
    }

    return (
        <div
            className={`w-[400px] min-h-[180px] p-4 rounded-xl shadow-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[101%] 
                ${isDarkMode ? 'bg-blue-800 text-white' : 'bg-blue-300 text-gray-700'}
            `}
            onClick={handleClick}
        >
            <div className="flex flex-col h-full justify-between">
                <div>
                    <h2 className="text-lg font-bold mb-1 truncate text-ellipsis text-orange-600">{project.title}</h2>
                    <p className={`text-sm leading-relaxed max-h-[50px] overflow-hidden text-ellipsis font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`} dangerouslySetInnerHTML={{ __html: project.description }}>
                        {/* {project.description} */}
                    </p>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs">
                    <span className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                        {new Date(project.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full
                        ${statusColorMap[project.status]}
                    `}>
                        {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard
