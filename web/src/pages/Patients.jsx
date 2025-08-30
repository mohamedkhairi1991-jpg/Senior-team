import React,{useEffect,useState} from 'react'; import {Link,useNavigate} from 'react-router-dom'; import {api} from '../api'
export default function Patients(){ const [list,setList]=useState([]),[name,setName]=useState(''),[age,setAge]=useState(''),[notes,setNotes]=useState(''),[error,setError]=useState(''); const nav=useNavigate()
async function load(){ try{ const {data}=await api.get('/patients'); setList(data) }catch(e){ if(e?.response?.status===401) nav('/login') } }
useEffect(()=>{ load() },[])
async function createPatient(e){ e.preventDefault(); setError(''); try{ await api.post('/patients',{name,age:age?Number(age):undefined,notes}); setName(''); setAge(''); setNotes(''); load() }catch(e){ setError(e?.response?.data?.error||'Create failed') } }
return(<div><h3>Patients</h3><form onSubmit={createPatient} style={{display:'grid',gap:8,maxWidth:500}}>{error&&<div style={{color:'red'}}>{error}</div>}
<input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /><input placeholder="Age" value={age} onChange={e=>setAge(e.target.value)} /><textarea placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
<button type="submit">Add Patient</button></form><hr/><ul>{list.map(p=>(<li key={p.id} style={{marginBottom:8}}><Link to={`/patients/${p.id}`}>{p.name}</Link> — {p.age ?? 'N/A'}</li>))}</ul></div>)}
