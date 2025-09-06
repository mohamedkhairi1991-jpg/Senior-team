import React,{useState} from 'react'; import {useNavigate} from 'react-router-dom'; import {api} from '../api'
export default function Register(){ const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[role,setRole]=useState('resident'),[error,setError]=useState(''); const nav=useNavigate()
async function onSubmit(e){e.preventDefault(); setError(''); try{ await api.post('/auth/register',{email,password,role}); const {data}=await api.post('/auth/login',{email,password}); localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); nav('/patients') }catch(e){ setError(e?.response?.data?.error||'Register failed') } }
return(<form onSubmit={onSubmit} style={{display:'grid',gap:8}}><h3>Register</h3>{error&&<div style={{color:'red'}}>{error}</div>}
<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<label>Role:&nbsp;<select value={role} onChange={e=>setRole(e.target.value)}><option value="resident">resident</option><option value="senior">senior</option></select></label>
<button type="submit">Create account</button></form>)}
