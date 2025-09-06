import React,{useState} from 'react'; import {useNavigate} from 'react-router-dom'; import {api} from '../api'
export default function Login(){ const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''); const nav=useNavigate()
async function onSubmit(e){e.preventDefault(); setError(''); try{ const {data}=await api.post('/auth/login',{email,password}); localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); nav('/patients') }catch(e){ setError(e?.response?.data?.error||'Login failed') } }
return(<form onSubmit={onSubmit} style={{display:'grid',gap:8}}><h3>Login</h3>{error&&<div style={{color:'red'}}>{error}</div>}
<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<button type="submit">Login</button></form>)}
