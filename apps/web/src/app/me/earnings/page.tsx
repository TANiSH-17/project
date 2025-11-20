'use client';
import React, { useEffect, useState } from 'react';

export default function EarningsPage() {
  const [email, setEmail] = useState('');
  const [payouts, setPayouts] = useState<any[]>([]);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    const e = localStorage.getItem('email') || '';
    setEmail(e);
    if (!e) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payouts?email=${encodeURIComponent(e)}`).then(r=>r.json()).then(setPayouts);
  }, []);

  async function requestPayout() {
    if (!email) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payouts`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY as string }, body: JSON.stringify({ email }) });
    const data = await res.json();
    setResult(data);
    const updated = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payouts?email=${encodeURIComponent(email)}`).then(r=>r.json());
    setPayouts(updated);
  }

  return (
    <section>
      <h1>My Earnings</h1>
      {!email && <p>Set your email in Settings first.</p>}
      <button onClick={requestPayout} disabled={!email}>Request Payout</button>
      {result && <pre style={{background:'#f6f6f6', padding:12, marginTop:12}}>{JSON.stringify(result, null, 2)}</pre>}
      <h2 style={{marginTop:16}}>Payouts</h2>
      <ul>
        {payouts.map(p => (
          <li key={p.id}>${'{'}(p.amount/100).toFixed(2){'}'} {p.currency} — {p.status} — {new Date(p.completedAt || p.initiatedAt).toLocaleString()}</li>
        ))}
      </ul>
    </section>
  );
}
