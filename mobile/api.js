import { API_URL } from './constants';
export async function api(path,{method='GET',token,body,isForm=false}={}) {
  const headers={};
  if(!isForm) headers['Content-Type']='application/json';
  if(token) headers['Authorization']=`Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`,{
    method,headers,body:isForm?body:(body?JSON.stringify(body):undefined)
  });
  if(!res.ok){throw new Error(await res.text()||'Request failed')}
  const ct=res.headers.get('content-type')||'';
  return ct.includes('application/json')?res.json():res.text();
}
