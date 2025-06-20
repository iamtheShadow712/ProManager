import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthSuccess = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const handleAuth = async () => {
            const params = new URLSearchParams(window.location.search)
            const code = params.get('code')

            if (!code) {
                toast.error('GitHub login failed: no code received')
                navigate('/auth/login')
                return
            }

            try {
                const response = await axios.get('http://localhost:8000/api/v1/auth/github/callback', {
                    params: { code },
                    withCredentials: true, // important if refresh token is sent via HttpOnly cookie
                })

                const { access_token } = response.data
                localStorage.setItem('token', access_token)

                toast.success('Login successful!')
                navigate('/')
            } catch (error) {
                console.error(error)
                toast.error('GitHub login failed.')
                navigate('/auth/login')
            }
        }

        handleAuth()
    }, [])

    return <div className='p-4'>Logging in via GitHub...</div>
}

export default AuthSuccess