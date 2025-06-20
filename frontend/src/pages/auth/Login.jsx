import { useState } from "react"
import useThemeStore from "../../store/useThemeStore"
import toast from 'react-hot-toast'
import useAuthStore from "../../store/useAuthStore"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const { login, isLoading, error } = useAuthStore()
    const { isDarkMode } = useThemeStore()
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        if (formData.username === "" || formData.password === "") {
            toast("All Fields are required", {
                style: { backgroundColor: "red", color: "white" },
                duration: 1500
            })
            return
        }
        await login(formData)

        if (error) {
            toast(error, {
                style: { backgroundColor: "red", color: "white" },
                duration: 2000
            })
            return
        }
        navigate('/', { replace: true })
        toast("Login Successfull", {
            style: { backgroundColor: "green", color: "white" },
            duration: 1000
        })
    }

    return (
        <div className={`p-8 rounded h-fit shadow-sm w-full max-w-md ${isDarkMode ? 'bg-[#1d1d1d] shadow-gray-800 ' : 'bg-[#ffedfe] shadow-gray-400'}`}>
            <h2 className="text-3xl font-bold mb-6 text-center text-purple-500">Login</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
                <input type="text" name="username" onChange={handleChange} placeholder="Username" className="input input-bordered border-orange-200 bg-[#f3f5f0] text-black placeholder:text-gray-400 placeholder:font-bold w-full" />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" className="input input-bordered border-orange-200 bg-[#f3f5f0] text-black placeholder:text-gray-400 placeholder:font-bold w-full" />
                <button type="submit" className="btn btn-primary w-full">
                    {isLoading ?
                        <span className="loading loading-dots loading-lg"></span>
                        : <span className="text-lg">Login</span>
                    }
                </button>
            </form>
        </div>
    )
}

export default Login