import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Health from './pages/Health'
import Login from './pages/Login'
import Patients from './pages/Patients'
import './index.css'

function Guard({children}:{children:React.ReactElement}){
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace/>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/health" replace/>} />
        <Route path="/health" element={<Health/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/patients" element={<Guard><Patients/></Guard>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
