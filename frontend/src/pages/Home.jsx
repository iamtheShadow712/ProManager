import React, { useEffect, useState } from 'react'
import useAppStore from '../store/useAppStore'
import useThemeStore from '../store/useThemeStore'
import useProjectStore from '../store/useProjectStore'
import ProjectCard from '../components/ProjectCard'
import { FolderPlus } from 'lucide-react'

const Home = () => {
    const { openModal } = useAppStore()
    const { isDarkMode } = useThemeStore()
    const { projects } = useProjectStore()
    const [projectList, setProjectList] = useState(projects.filter(project => project.status === "active"))
    const [currentStatus, setCurrentStatus] = useState('active')

    useEffect(() => {
        const currentStatusProjects = projects.filter(project => project.status === currentStatus)
        setProjectList(currentStatusProjects)
    }, [currentStatus, projects])

    const projectStatus = [
        { title: "Backlog", value: "backlog" },
        { title: "Active", value: "active" },
        { title: "Completed", value: "completed" },
        { title: "On Hold", value: "on_hold" },
        { title: "Cancelled", value: "cancelled" },
        { title: "Archieved", value: "archived" },
    ]


    return (
        <div className='px-2 w-full'>
            <div className='flex justify-between items-center'>
                <h1 className='text-primary text-3xl font-bold capitalize underline'>Projects</h1>
                <div className='flex gap-3'>
                    <select defaultValue="active" name="projectStatus" onChange={(e) => setCurrentStatus(e.target.value)} id="projectStatus" className={`btn text-start select select-primary w-fit text-md bg-violet-600 text-white`}>
                        {
                            projectStatus.map(status => (
                                <option key={status.value} value={status.value}>{status.title}</option>
                            ))
                        }
                    </select>
                    <button className='btn btn-primary' onClick={() => openModal("create_project")}>Create Project</button>
                </div>
            </div>
            <div className='grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 mt-6 gap-5 justify-between'>
                {
                    projectList.length > 0 ? projectList.map(project => (
                        <ProjectCard project={project} key={project.id} />
                    ))
                        :
                        <div className={`col-span-full flex flex-col items-center justify-center mt-10 ${isDarkMode ? 'text-orange-50' : 'text-black'}`}>
                            <FolderPlus className="w-16 h-16 text-blue-500 mb-4" />
                            <h2 className="text-xl font-semibold">No projects found</h2>
                            <p className="text-sm">Start by creating your first project to manage tasks effectively.</p>
                        </div>
                }
            </div>
        </div>
    )
}

export default Home