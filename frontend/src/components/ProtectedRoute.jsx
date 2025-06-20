import { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const ProtectedRoute = () => {
    if (localStorage.getItem("token")) {
        return <Outlet />
    }

    return <Navigate to="/auth/login" replace={true} />
}

export default ProtectedRoute