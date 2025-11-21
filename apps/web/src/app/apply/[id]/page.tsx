'use client';
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

export default function ApplyPage({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('I would like to participate.');
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { const v = localStorage.getItem('email'); if (v) setEmail(v); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await apiFetch(`/campaigns/${params.id}/applications`, {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ email, message }),
      });
      setResult(await res.json());
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h1>Apply to Campaign</h1>
      <form onSubmit={submit} style={{display:'grid', gap:12, maxWidth:420}}>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label>Message<textarea value={message} onChange={e=>setMessage(e.target.value)} /></label>
        <button disabled={busy} type="submit">{busy ? 'Submitting...' : 'Submit Application'}</button>
      </form>
      {result && (
        <div style={{marginTop:16}}>
          <p>Application submitted! Ask an admin to approve it.</p>
          <pre style={{background:'#f6f6f6', padding:12}}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
