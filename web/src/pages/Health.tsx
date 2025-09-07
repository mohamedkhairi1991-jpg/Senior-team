import { useEffect, useState } from "react";
import { http } from "../api";

export default function Health(){
  const [data,setData] = useState<any>(null);
  useEffect(()=>{ 
    http.get("/api/healthz").then(r=>setData(r.data)).catch(console.error); 
  },[]);
  
  return <pre>{JSON.stringify(data,null,2)}</pre>;
}
