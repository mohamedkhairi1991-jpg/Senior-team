import React,{useEffect,useState} from 'react'; import {useParams} from 'react-router-dom'; import {api} from '../api'
const sections=['history','examination','investigation','treatment']
export default function PatientDetail(){ const {id}=useParams(); const [patient,setPatient]=useState(null),[entries,setEntries]=useState({}),[content,setContent]=useState(''),[active,setActive]=useState('history'),[recs,setRecs]=useState([]),user=JSON.parse(localStorage.getItem('user')||'null'),[imgList,setImgList]=useState([]),[file,setFile]=useState(null)
async function loadPatient(){ const {data}=await api.get(`/patients/${id}`); setPatient(data) }
async function loadEntries(section){ const {data}=await api.get(`/entries/${id}?section=${section}`); setEntries(prev=>({...prev,[section]:data})) }
async function loadRecs(){ const {data}=await api.get(`/recommendations/${id}`); setRecs(data) }
async function loadImages(){ const {data}=await api.get(`/images/${id}`); setImgList(data) }
useEffect(()=>{ loadPatient(); sections.forEach(loadEntries); loadRecs(); loadImages() },[id])
async function addEntry(e){ e.preventDefault(); if(!content) return; await api.post(`/entries/${id}?section=${active}`,{content}); setContent(''); loadEntries(active) }
async function addRec(e){ e.preventDefault(); if(!content) return; await api.post(`/recommendations/${id}`,{content}); setContent(''); loadRecs() }
async function uploadImage(e){ e.preventDefault(); if(!file) return; const form=new FormData(); form.append('file',file); await api.post(`/images/${id}`,form,{headers:{'Content-Type':'multipart/form-data'}}); setFile(null); loadImages() }
if(!patient) return <div>Loading...</div>
return(<div><h3>Patient: {patient.name}</h3><p>Age: {patient.age ?? 'N/A'}</p><p>Notes: {patient.notes||'—'}</p>
<div style={{display:'flex',gap:8,margin:'16px 0'}}>{sections.map(s=>(<button key={s} onClick={()=>setActive(s)} style={{fontWeight:active===s?'bold':'normal'}}>{s}</button>))}</div>
<form onSubmit={user?.role==='senior'?addRec:addEntry} style={{display:'grid',gap:8,maxWidth:600}}>
<textarea placeholder={user?.role==='senior'?'Write senior recommendation...':`Add ${active} entry...`} value={content} onChange={e=>setContent(e.target.value)}/>
<button type="submit">{user?.role==='senior'?'Add Recommendation':`Add to ${active}`}</button></form>
<div style={{display:'grid',gap:16,gridTemplateColumns:'1fr 1fr'}}><div><h4>Entries — {active}</h4><ul>{(entries[active]||[]).map(en=>(<li key={en.id}><small>{new Date(en.created_at).toLocaleString()}</small><br/>{en.content}</li>))}</ul></div>
<div><h4>Senior Recommendations</h4><ul>{recs.map(r=>(<li key={r.id}><small>{new Date(r.created_at).toLocaleString()}</small><br/>{r.content}</li>))}</ul></div></div>
<hr/><h4>Images</h4><form onSubmit={uploadImage} style={{display:'flex',gap:8,alignItems:'center'}}><input type="file" onChange={e=>setFile(e.target.files?.[0]||null)}/><button type="submit">Upload</button></form>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:8,marginTop:12}}>{imgList.map(img=>(<a key={img.id} href={img.url} target="_blank" rel="noreferrer"><img src={img.url} alt="" style={{width:'100%',height:120,objectFit:'cover'}}/></a>))}</div></div>)}
