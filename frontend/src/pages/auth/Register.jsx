import toast from "react-hot-toast"
import useThemeStore from "../../store/useThemeStore"
import { useRef, useState } from "react"
import useAuthStore from "../../store/useAuthStore"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const { isDarkMode } = useThemeStore()
    const { register, isLoading, error } = useAuthStore()
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        full_name: "",
        password: "",
    })
    const [cPassword, setCPassword] = useState("")
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        if (formData.email === "" || formData.full_name === "" || formData.username === "" || formData.password === "" || cPassword === "") {
            toast("All Fields are required", {
                style: { backgroundColor: "red", color: "white" },
                duration: 1500
            })
            return
        }

        if (formData.password !== cPassword) {
            toast("Passwords do not match", {
                style: { backgroundColor: "red", color: "white" },
                duration: 1500
            })
            return
        }
        await register(formData)
        if (error) {
            toast(error, {
                style: { backgroundColor: "red", color: "white" },
                duration: 2000
            })
            return
        }
        toast("Registration Successfull", {
            style: { backgroundColor: "green", color: "white" },
            duration: 1000
        })
        navigate('/auth/login')
    }

    const handleGithubLogin = () => {
        window.location.href = "http://localhost:8000/api/v1/auth/github/login"
    }

    return (
        <div className={`p-8 rounded  shadow-sm h-fit  w-full max-w-md ${isDarkMode ? 'bg-[#1d1d1d] shadow-gray-800' : 'bg-[#ffedfe] shadow-gray-400'}`}>
            <h2 className="text-3xl font-bold mb-6 text-center text-purple-500">Register</h2>
            <form className="space-y-4" onSubmit={handleRegister}>
                <input type="text" name="username" onChange={handleChange} placeholder="Username" className="input input-bordered border-orange-200 bg-[#f3f5f0] text-black placeholder:text-gray-400 placeholder:font-bold w-full" />
                <input type="text" name="full_name" onChange={handleChange} placeholder="Full Name" className="input input-bordered border-orange-200 bg-[#f3f5f0] text-black placeholder:text-gray-400 placeholder:font-bold w-full" />
                <input type="email" name="email" onChange={handleChange} placeholder="Email" className="input input-bordered border-orange-200 bg-[#f3f5f0] text-black placeholder:text-gray-400 placeholder:font-bold w-full" />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" className="input input-bordered border-orange-200 bg-[#f3f5f0] text-black placeholder:text-gray-400 placeholder:font-bold w-full" />
                <input type="password" onChange={(e) => setCPassword(e.target.value)} placeholder="Confirm Password" className="input input-bordered border-orange-200 bg-[#f3f5f0] text-black placeholder:text-gray-400 placeholder:font-bold w-full" />
                <button type="submit" className="btn btn-primary w-full">
                    {isLoading ?
                        <span className="loading loading-dots loading-lg"></span>
                        : <span className="text-lg">Register</span>
                    }
                </button>
            </form>
            {/* <div className="mt-4">
                <button className="btn w-full bg-gray-600 hover:bg-gray-700 text-lg" onClick={handleGithubLogin}>Login With Github</button>
            </div> */}
        </div>
    )
}

export default Register
