'use client';
import React, { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function DemoPage() {
  const [result, setResult] = useState<any | null>(null);
  const [seeding, setSeeding] = useState(false);

  async function runSeed() {
    setSeeding(true);
    try {
      const res = await apiFetch('/admin/seed', { method: 'POST', body: JSON.stringify({ campaigns: 2 }) });
      const data = await res.json?.().catch?.(() => res) as any;
      setResult(data || res);
    } catch (e) {
      console.error(e);
      alert('Seed failed');
    } finally {
      setSeeding(false);
    }
  }

  return (
    <section>
      <h1>Demo Walkthrough</h1>
      <ol>
        <li>Click "Seed demo data" to create a couple of campaigns (Clicks and Views) and participations.</li>
        <li>Browse campaigns: <a href="/campaigns">/campaigns</a></li>
        <li>Open a campaign and apply if you want your own participation.</li>
        <li>Approve applications: <a href="/admin/applications">/admin/applications</a></li>
        <li>Generate clicks: use the tracking link shown after approval (or in "My" page).</li>
        <li>View earnings: <a href="/dashboard">/dashboard</a> (enter Participation ID) and <a href="/me">/me</a>.</li>
      </ol>
      <button onClick={runSeed} disabled={seeding}>{seeding ? 'Seeding...' : 'Seed demo data'}</button>
      {result && (
        <div style={{marginTop:16}}>
          <h3>Created</h3>
          <pre style={{background:'#f6f6f6', padding:12}}>{JSON.stringify(result, null, 2)}</pre>
          <div>
            {result.participations?.map((p: any) => (
              <div key={p.id} style={{marginBottom:8}}>
                Participation: {p.id} — Tracking: <a href={`${process.env.NEXT_PUBLIC_API_URL}/t/${p.trackingLink}`} target="_blank">/t/{p.trackingLink}</a>
              </div>
            ))}
          </div>
        </div>
      )}
      <p style={{marginTop:16}}>Tip: Set your email at <a href="/settings">/settings</a> and role ADMIN via devtools if you need admin: <code>localStorage.setItem('role','ADMIN')</code>.</p>
    </section>
  );
}
