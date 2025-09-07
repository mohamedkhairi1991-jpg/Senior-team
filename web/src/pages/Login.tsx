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
    <div style={{
      display: "flex",
      alignItems: "center", 
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      backgroundColor: "#f5f5f5"
    }}>
      <form onSubmit={onSubmit} style={{
        display: "grid",
        gap: "16px",
        maxWidth: "400px",
        width: "100%",
        padding: "40px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "20px",
          fontSize: "24px"
        }}>🏥 Hospital Login</h2>
        
        <div>
          <label style={{color: "#555", fontSize: "14px", marginBottom: "4px", display: "block"}}>
            Email Address
          </label>
          <input 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>
        
        <div>
          <label style={{color: "#555", fontSize: "14px", marginBottom: "4px", display: "block"}}>
            Password
          </label>
          <input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>
        
        {error && <div style={{
          color: "#e74c3c",
          backgroundColor: "#fee",
          padding: "12px",
          borderRadius: "4px",
          border: "1px solid #e74c3c",
          fontSize: "14px"
        }}>{error}</div>}
        
        <button style={{
          padding: "12px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: "pointer",
          fontWeight: "500",
          marginTop: "8px"
        }}>Sign In</button>
        
        <div style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#888",
          marginTop: "16px"
        }}>
          Demo: chief@example.com / test
        </div>
      </form>
    </div>
  );
}
