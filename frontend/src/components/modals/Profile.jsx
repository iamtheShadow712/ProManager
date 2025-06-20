import React from 'react'
import useAuthStore from '../../store/useAuthStore'
import { UserCircle } from 'lucide-react'

const Profile = () => {
    const { user } = useAuthStore()
    return (
        <div className="">
            <h1 className="text-center text-4xl font-bold mb-4 text-purple-600">Profile</h1>
            <hr className="border-gray-300 mb-4" />

            <div className="flex flex-col items-center gap-4">
                {user?.profilePic ? (
                    <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                ) : (
                    <UserCircle className="w-24 h-24 text-gray-400" />
                )}

                <div className="text-center">
                    <h2 className="text-xl font-semibold">{user?.full_name || "Full Name"}</h2>
                    <p className="">@{user?.username || "username"}</p>
                    <p className="">{user?.email || "email@example.com"}</p>
                </div>
            </div>
        </div>
    )
}

export default Profile