import axios from 'axios'
const baseURL = import.meta.env.VITE_API_URL || window.API_URL || 'http://localhost:3000'
export const api = axios.create({ baseURL })
api.interceptors.request.use(cfg => { const t=localStorage.getItem('token'); if(t) cfg.headers.Authorization=`Bearer ${t}`; return cfg })
