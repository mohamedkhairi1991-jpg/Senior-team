import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, ScrollView } from 'react-native';

const API = 'https://YOUR-BACKEND-URL.replit.dev';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [out, setOut] = useState('');

  const post = async (path, body) => {
    const res = await fetch(API + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: JSON.stringify(body)
    });
    return res.json();
  };

  const get = async (path) => {
    const res = await fetch(API + path, { headers: { ...(token ? { Authorization: 'Bearer ' + token } : {}) } });
    return res.json();
  };

  return (
    <SafeAreaView style={{ padding: 16 }}>
      <ScrollView>
        <Text style={{ fontSize: 24, fontWeight: '600' }}>Senior Team (Expo)</Text>
        <Text>API: {API}</Text>
        <TextInput placeholder="email" value={email} onChangeText={setEmail} style={{borderWidth:1, marginVertical:8, padding:8}}/>
        <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={{borderWidth:1, marginVertical:8, padding:8}}/>
        <Button title="Register (resident)" onPress={async ()=>setOut(JSON.stringify(await post('/api/auth/register',{email,password,role:'resident'}),null,2))} />
        <Button title="Login" onPress={async ()=>{ const j = await post('/api/auth/login',{email,password}); setToken(j.token||''); setOut(JSON.stringify(j,null,2)); }} />
        <TextInput placeholder="patient name" value={name} onChangeText={setName} style={{borderWidth:1, marginVertical:8, padding:8}}/>
        <Button title="Add patient" onPress={async ()=>setOut(JSON.stringify(await post('/api/patients',{name}),null,2))} />
        <Button title="List patients" onPress={async ()=>setOut(JSON.stringify(await get('/api/patients'),null,2))} />
        <Text selectable style={{ marginTop: 16 }}>{out}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}