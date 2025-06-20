import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import useProjectStore from '../store/useProjectStore'

const HomeLayout = () => {
    const { fetchAllProjects, resetTasksProjectId } = useProjectStore()
    useEffect(() => {
        const fetchProjects = async () => {
            await fetchAllProjects()
        }

        fetchProjects()
    }, [])

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 p-4 mt-[70px]">
                <Outlet />
            </div>
        </div>
    )
}

export default HomeLayout