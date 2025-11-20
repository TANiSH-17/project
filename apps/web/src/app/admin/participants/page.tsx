'use client';
import React, { useState } from 'react';
import { apiFetch } from '../../../lib/api';

export default function AdminParticipantsActions() {
  const [id, setId] = useState('');
  const [result, setResult] = useState<any>(null);

  async function invoke(path: string) {
    const res = await apiFetch(`/participants/${id}/${path}`, { method: 'POST' });
    setResult(await res.json());
  }

  return (
    <section>
      <h1>Participant Accruals (Admin Demo)</h1>
      <input placeholder="participation id" value={id} onChange={e=>setId(e.target.value)} />
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={() => invoke('accrue')}>Accrue from clicks</button>
        <button onClick={() => invoke('lock')}>Lock eligible</button>
      </div>
      {result && (
        <pre style={{background:'#f6f6f6', padding:12, marginTop:12}}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
}
