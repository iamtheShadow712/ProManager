import axios from "axios";
import toast from "react-hot-toast";

const axiosHandler = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})


axiosHandler.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.error("Request Interceptor Error:", error)
        return Promise.reject(error)
    }
)


axiosHandler.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(typeof (error?.response?.status))
        if (error?.response?.status === 401) {
            toast.error("Session expired. Please login again.");
            console.log(error)
            localStorage.removeItem("token");

            // 👇 redirect logic here
            window.location.href = "/auth/login";
            console.log("here")
        }
        return Promise.reject(error);
    }
)

export default axiosHandler