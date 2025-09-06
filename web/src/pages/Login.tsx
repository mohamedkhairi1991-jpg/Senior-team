import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login(){
  const [email,setEmail] = useState("chief@example.com");
  const [password,setPassword] = useState("test");
  const [error,setError] = useState<string|undefined>();
  const nav = useNavigate();
  
  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    try{
      const {token} = await login(email,password);
      localStorage.setItem("token", token);
      nav("/patients");
    }catch(err:any){ 
      setError(err.message || "Login failed"); 
    }
  }
  
  return (
    <form onSubmit={onSubmit} style={{display:"grid",gap:8,maxWidth:360}}>
      <h2>Login</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
      {error && <div style={{color:"crimson"}}>{error}</div>}
      <button>Login</button>
    </form>
  );
}
