import React, { useEffect } from 'react'
import Header from '../components/Header'
import { Outlet, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import useProjectStore from '../store/useProjectStore'

const ProjectLayout = () => {
    const { fetchProjectById, fetchtasksByProjectId } = useProjectStore()
    const { id } = useParams()

    useEffect(() => {
        const fetchProject = async () => {
            await fetchProjectById(id)
            await fetchtasksByProjectId(id)
        }
        fetchProject()
    }, [id])

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className='min-h-[80vh] flex flex-1'>
                <Sidebar />
                <div className="md:ml-[250px] flex-1 p-4 mt-[70px]">
                    <Outlet />
                </div>
            </div>

        </div>
    )
}

export default ProjectLayout