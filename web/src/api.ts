import axios from "axios";
export const API_BASE = import.meta.env.VITE_API_URL!;
export const http = axios.create({ baseURL: API_BASE });
export async function login(email: string, password: string){
  const {data} = await http.post("/auth/login",{email,password});
  return data as {token:string, role:string};
}
export async function getPatients(token: string){
  const {data} = await http.get("/patients",{ headers:{ Authorization:`Bearer ${token}` }});
  return data as Array<{id:number; name:string; age:number}>;
}
