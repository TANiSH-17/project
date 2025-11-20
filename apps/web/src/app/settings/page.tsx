'use client';
import React, { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [email, setEmail] = useState('');
  useEffect(() => { const v = localStorage.getItem('email'); if (v) setEmail(v); }, []);
  function save() { localStorage.setItem('email', email); alert('Saved!'); }
  return (
    <section>
      <h1>Settings</h1>
      <p>Set your email to use for applications and "My" pages (demo auth).</p>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
      <button onClick={save} style={{marginLeft:8}}>Save</button>
    </section>
  );
}
