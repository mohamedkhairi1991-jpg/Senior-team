import React from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
export default function App(){
  const navigate=useNavigate(); const user=JSON.parse(localStorage.getItem('user')||'null')
  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login') }
  return(<div style={{maxWidth:900,margin:'0 auto',padding:16,fontFamily:'system-ui,sans-serif'}}>
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
      <h2 style={{margin:0}}><Link to="/patients" style={{textDecoration:'none'}}>🏥 Hospital Coordination</Link></h2>
      <nav style={{display:'flex',gap:12,alignItems:'center'}}>{user?(<>
        <span>👤 {user.email} ({user.role})</span><button onClick={logout}>Logout</button></>):(<>
        <Link to="/login">Login</Link><Link to="/register">Register</Link></>)}</nav>
    </header><Outlet/></div>)
}
