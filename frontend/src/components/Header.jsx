import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import useThemeStore from "../store/useThemeStore"
import useAppStore from "../store/useAppStore"
import useAuthStore from "../store/useAuthStore"
import toast from "react-hot-toast"
import useProjectStore from "../store/useProjectStore"

const Header = () => {
    const { toggleTheme, isDarkMode } = useThemeStore()
    const { openModal } = useAppStore()
    const { logout } = useAuthStore()
    const { resetTasksProjectId } = useProjectStore()
    const url = useLocation()
    const [headerPage, setHeaderPage] = useState("login")
    const [openMenu, setOpenMenu] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (url.pathname.includes('/login')) {
            setHeaderPage("login")
        } else if (url.pathname.includes('/register')) {
            setHeaderPage("register")
        } else {
            setHeaderPage("/")
        }
    }, [url.pathname])


    const handleThemeChange = (e) => {
        toggleTheme()
    }

    const toggleMenu = () => {
        setOpenMenu(prev => prev = !prev)
    }

    const handleProfileClick = () => {
        openModal("profile")
        setOpenMenu(prev => prev = false)
    }

    const handleLogout = async () => {
        await logout()
        toast("Logged Out", {
            style: { backgroundColor: "green", color: "white" },
            duration: 1000
        })
        // resetTasksProjectId()
        navigate('/auth/login')
    }

    return (
        <div className={`navbar fixed top-0 left-0 right-0 w-full z-50 shadow ${isDarkMode ? 'bg-base-300 shadow-base-100 z-10' : 'bg-white'}`}>
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-3xl text-purple-600 ">ProManager</Link>
            </div>
            <div className="flex items-center pr-3 gap-2">
                <input type="checkbox" checked={!isDarkMode} className={`toggle ${isDarkMode ? 'text-orange-500 bg-white' : 'text-white bg-orange-500'}`} onChange={handleThemeChange} />
                <div>
                    {headerPage === "login" &&
                        <Link to="/auth/register" className="btn btn-primary">Register</Link>
                    }
                    {
                        headerPage === "register" &&
                        <Link to="/auth/login" className="btn btn-md btn-primary text-lg">Login</Link>
                    }
                    {
                        headerPage === "/" &&
                        <div className="relative">
                            <div className="avatar cursor-pointer" onClick={toggleMenu}>
                                <div className="w-10 rounded-full">
                                    <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                                </div>
                            </div>
                            {
                                openMenu &&
                                <ul className={`absolute right-0 w-[150px] flex flex-col gap-2 rounded-box z-1 p-1 shadow-sm ${isDarkMode ? 'bg-gray-600' : 'bg-yellow-50'}`}>
                                    <li className={`cursor-pointer p-1 px-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-amber-200'}`} onClick={handleProfileClick}><span>Profle</span></li>
                                    <li className={`cursor-pointer p-1 px-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-amber-200'}`} onClick={handleLogout}><span>Logout</span></li>
                                </ul>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header