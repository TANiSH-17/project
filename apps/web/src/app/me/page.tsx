'use client';
import React, { useEffect, useState } from 'react';

export default function MyPage() {
  const [email, setEmail] = useState('');
  const [apps, setApps] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);

  useEffect(() => {
    const e = localStorage.getItem('email') || '';
    setEmail(e);
    if (!e) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${encodeURIComponent(e)}/applications`).then(r=>r.json()).then(setApps);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${encodeURIComponent(e)}/participations`).then(r=>r.json()).then(setParts);
  }, []);

  if (!email) return <section><h1>My Stuff</h1><p>Set your email in Settings to view your applications and participations.</p></section>;

  return (
    <section>
      <h1>My Stuff</h1>
      <div style={{marginTop:8}}><a href="/me/billing">Connect Stripe (test) →</a></div>
      <h2>Applications</h2>
      <ul>
        {apps.map(a => (
          <li key={a.id} style={{marginBottom:8}}>
            {a.campaign?.title} — {a.status}
          </li>
        ))}
      </ul>
      <div style={{marginTop:8}}><a href="/me/earnings">View my earnings →</a></div>
      <h2>Participations</h2>
      <ul>
        {parts.map(p => (
          <li key={p.id} style={{marginBottom:8}}>
            <div><strong>{p.campaign?.title}</strong></div>
            <div>Clicks: {p.clicks} — Est. earnings: ${(p.earningsCents/100).toFixed(2)} {p.campaign?.currency}</div>
            <div>Tracking: <a href={`${process.env.NEXT_PUBLIC_API_URL}/t/${p.trackingLink}`} target="_blank">/t/{p.trackingLink}</a></div>
            <div><a href={`/participants/${p.id}/submit`}>Submit content →</a></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
