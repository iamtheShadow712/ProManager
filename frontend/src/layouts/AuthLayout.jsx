import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const AuthLayout = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex justify-center min-h-[80vh] p-4 pt-[160px]">
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout