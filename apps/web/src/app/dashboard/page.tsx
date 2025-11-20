'use client';
import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [participantId, setParticipantId] = useState('');
  const [metrics, setMetrics] = useState<any | null>(null);

  async function load() {
    if (!participantId) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/participants/${participantId}/metrics`);
    if (res.ok) setMetrics(await res.json());
  }

  useEffect(() => { load(); }, [participantId]);

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Enter your Participation ID to see clicks and estimated earnings (demo):</p>
      <input placeholder="participation id" value={participantId} onChange={e=>setParticipantId(e.target.value)} />
      <button onClick={load} style={{marginLeft:8}}>Load</button>
      {metrics && (
        <div style={{marginTop:16}}>
          {metrics.metricType === 'CLICKS' ? (
            <div>Clicks: {metrics.clicks}</div>
          ) : (
            <div>Views: {metrics.views}</div>
          )}
          <div>Rate: ${(metrics.ratePerThousand/100).toFixed(2)} per 1k</div>
          <div>Estimated earnings: ${(metrics.earningsCents/100).toFixed(2)} {metrics.currency}</div>
          <p>Shareable tracking link: http://localhost:4000/t/&lt;your tracking code&gt; (from approval)</p>
        </div>
      )}
    </section>
  );
}
