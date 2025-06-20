import { create } from "zustand";
import axiosHandler from "../utils/axios";
import { persist } from "zustand/middleware";

const useProjectStore = create(persist((set, get) => ({
    projects: [],
    currentProject: null,
    projectTasks: [],
    currentTask: null,
    tasksProjectId: null,
    resetTasksProjectId: () => set({ tasksProjectId: null }),
    hydrated: false,
    setHydrated: () => set({ hydrated: true }),
    isLoading: false,
    error: null,
    setCurrentTask: (task) => set({ currentTask: task }),
    fetchAllProjects: async () => {
        set({ isLoading: true, error: null })
        try {
            const res = await axiosHandler.get("/projects")
            set({ projects: res.data, isLoading: false, error: null })
        } catch (error) {
            set({ isLoading: false, error: error.message || "Network Error" })
        }
    },
    fetchProjectById: async (projectId) => {
        set({ isLoading: true, error: null })
        try {
            console.log(projectId)
            const res = await axiosHandler.get(`/projects/${projectId}`)
            console.log(res.data)
            set({ currentProject: res.data, isLoading: false, error: null })
        } catch (error) {
            set({ isLoading: false, error: error.message || "Network Error" })
        }
    },
    createProject: async (payload) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axiosHandler.post("/projects", payload)
            set({ projects: [...(get().projects || []), res.data], isLoading: false, error: null })
        } catch (error) {
            set({ isLoading: false, error: error.message || "Network Error" })
        }
    },
    updateProject: async (projectId, payload) => {
        set({ isLoading: true, error: null })
        console.log(projectId)
        try {
            const res = await axiosHandler.patch(`/projects/${projectId}`, payload)
            set({
                currentProject: res.data,
                isLoading: false,
                error: null
            })
        } catch (error) {
            set({ isLoading: false, error: error.message || "Network Error" })
        }
    },
    createTask: async (payload, projectId) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axiosHandler.post(`/projects/${projectId}/tasks`, payload)
            console.log(res)
            set({ projectTasks: [...get().projectTasks, res.data], isLoading: false, error: null })
        } catch (error) {
            set({ isLoading: false, error: error.message || "Network Error" })
        }
    },
    fetchtasksByProjectId: async (projectId) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axiosHandler.get(`/projects/${projectId}/tasks`)
            console.log(res.data)
            set({ projectTasks: res.data, tasksProjectId: projectId, isLoading: false, error: null })
            console.log(get().tasksProjectId)
        } catch (error) {
            set({ isLoading: false, error: error.message || "Network Error" })
        }
    },
    updateTask: async (projectId, taskId, payload) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axiosHandler.patch(`/projects/${projectId}/tasks/${taskId}`, payload)
            const updatedTask = res.data

            set((state) => ({
                projectTasks: state.projectTasks.map(task =>
                    task.id === taskId ? updatedTask : task
                ),
                currentTask: state.currentTask?.id === taskId ? updatedTask : state.currentTask,
                isLoading: false,
                error: null
            }))
        } catch (error) {
            set({ isLoading: false, error: error.message || "Network Error" })
        }
    }
}), {
    name: "projects",
    onRehydrateStorage: () => (state) => {
        state?.setHydrated();
    },
}))

export default useProjectStore