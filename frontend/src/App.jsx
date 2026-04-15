import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from  './pages/SignupPage.jsx'  

function App() {
  return (
    <Routes>
        <Route path="/" element={<ChatPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />

    </Routes>
  )
}

export default App