import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
function Root(){return(<BrowserRouter><Routes><Route path="/" element={<App/>}>
<Route index element={<Navigate to="/patients"/>}/><Route path="login" element={<Login/>}/>
<Route path="register" element={<Register/>}/><Route path="patients" element={<Patients/>}/>
<Route path="patients/:id" element={<PatientDetail/>}/></Route></Routes></BrowserRouter>)}
createRoot(document.getElementById('root')).render(<Root/>)
