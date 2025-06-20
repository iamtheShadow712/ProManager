import React from 'react'
import useThemeStore from '../store/useThemeStore'
import { NavLink, useParams } from 'react-router-dom';

const Sidebar = () => {
    const { isDarkMode } = useThemeStore()
    const { id } = useParams()

    const navLinks = [
        { name: "Details", path: `/projects/${id}` },
        { name: "Task Board", path: `/projects/${id}/board` },
        { name: "Backlog", path: `/projects/${id}/backlog` },
    ];

    return (
        <div className={`fixed inset-0 top-[64px] bottom-0 w-[250px] p-4 shadow-md z-20 ${isDarkMode ? 'bg-[#191919] text-white' : 'bg-blue-100 text-black'}`}>
            <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end
                        className={({ isActive }) =>
                            `py-2 px-4 rounded-md font-medium transition-all ${isActive
                                ? isDarkMode
                                    ? "bg-gray-800 text-white"
                                    : "bg-blue-300 text-black"
                                : isDarkMode
                                    ? "hover:bg-gray-800"
                                    : "hover:bg-blue-200"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}

export default Sidebar