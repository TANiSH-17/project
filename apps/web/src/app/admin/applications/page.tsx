'use client';
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch(`/applications`);
      const data = await res.json();
      setApps(data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function approve(id: string) {
    await apiFetch(`/applications/${id}/approve`, { method: 'POST' });
    await load();
  }

  return (
    <section>
      <h1>Applications</h1>
      {loading && <p>Loading...</p>}
      <ul>
        {apps.map((a) => (
          <li key={a.id} style={{marginBottom:12, padding:8, border:'1px solid #eee'}}>
            <div><strong>{a.campaign?.title}</strong></div>
            <div>User: {a.user?.email}</div>
            <div>Status: {a.status}</div>
            {a.status !== 'APPROVED' && (<button onClick={() => approve(a.id)}>Approve</button>)}
            {a.participation && (
              <div>
                <div>Participation: {a.participation.id}</div>
                <div>Tracking link: <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('http://localhost:4000','http://localhost:4000')}/t/${a.participation.trackingLink}`} target="_blank">/t/{a.participation.trackingLink}</a></div>
                <div><a href={`/participants/${a.participation.id}/submit`}>Submit content →</a></div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
