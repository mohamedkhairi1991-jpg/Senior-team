import { useEffect, useState } from "react";
import { getPatients } from "../api";

export default function Patients(){
  const [rows,setRows] = useState<Array<{id:number;name:string;age:number}>>([]);
  const token = localStorage.getItem("token") || "";
  
  useEffect(()=>{
    if(!token) return;
    getPatients(token).then(setRows).catch(console.error);
  },[token]);
  
  if(!token) return <p>Please login first.</p>;
  
  return (
    <div>
      <h2>Patients</h2>
      <ul>{rows.map(p => <li key={p.id}>{p.name} — {p.age}</li>)}</ul>
    </div>
  );
}
