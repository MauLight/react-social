import { GoogleOAuthProvider } from '@react-oauth/google';
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './views/Login'
import { Home } from './views/Home'
import { useEffect } from 'react';
import { fetchUser } from './utils/fetchuser';

function App() {

  const navigate = useNavigate()

  useEffect(() => {
    const user = fetchUser()
    if (!user) navigate('/login')
  })

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_ID}>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='/*' element={<Home />} />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App
