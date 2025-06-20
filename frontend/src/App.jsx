import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import useThemeStore from './store/useThemeStore'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import HomeLayout from './layouts/HomeLayout'
import Home from './pages/Home'
import Modal from './components/modals/Modal'
import useAppStore from './store/useAppStore'
import ProjectLayout from './layouts/ProjectLayout'
import ProjectDetail from './pages/project/ProjectDetail'
import ProjectTaskBoard from './pages/project/ProjectTaskBoard'
import ProjectBacklog from './pages/project/ProjectBacklog'
import CardMenu from './components/taskboard/CardMenu'
import AuthSuccess from './pages/auth/AuthSuccess'

function App() {
  const { isDarkMode } = useThemeStore()
  const { isOpen } = useAppStore()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#F8FAFC] text-black'}`}>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<AuthLayout />}>
            <Route index element={<Navigate to="login" />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="github/success" element={<AuthSuccess />} />
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<HomeLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Route>
          <Route path="/projects" element={<ProtectedRoute />}>
            <Route element={<ProjectLayout />}>
              <Route path=':id' element={<ProjectDetail />} />
              <Route path=':id/board' element={<ProjectTaskBoard />} />
              <Route path=':id/backlog' element={<ProjectBacklog />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
      {
        isOpen && <Modal />
      }
      <CardMenu />
    </div>
  )
}

export default App
