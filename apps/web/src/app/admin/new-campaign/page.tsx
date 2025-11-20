'use client';
import React, { useState } from 'react';
import { apiFetch } from '../../../lib/api';

export default function NewCampaignPage() {
  const [title, setTitle] = useState('Demo Campaign');
  const [brief, setBrief] = useState('Create content showcasing our product.');
  const [budget, setBudget] = useState(500000); // cents
  const [rate, setRate] = useState(1500); // cents per 1k
  const [metricType, setMetricType] = useState<'VIEWS' | 'CLICKS' | 'INTERACTIONS' | 'CONVERSIONS'>('VIEWS');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await apiFetch(`/campaigns`, {
        method: 'POST',
        headers: {},
        body: JSON.stringify({
          title,
          brief,
          budgetTotal: budget,
          budgetRemaining: budget,
          ratePerThousand: rate,
          metricType,
          currency: 'USD',
          brandName: 'Demo Brand',
          email: `brand-${Date.now()}@example.com`,
          targetUrl: (document.querySelector('input[name="targetUrl"]') as HTMLInputElement)?.value || null,
        }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h1>Create Campaign (Demo)</h1>
      <form onSubmit={createCampaign} style={{display:'grid', gap:12, maxWidth:520}}>
        <label>Title<input value={title} onChange={e=>setTitle(e.target.value)} /></label>
        <label>Brief<textarea value={brief} onChange={e=>setBrief(e.target.value)} /></label>
        <label>Budget (cents)<input type="number" value={budget} onChange={e=>setBudget(Number(e.target.value))} /></label>
        <label>Rate per 1k (cents)<input type="number" value={rate} onChange={e=>setRate(Number(e.target.value))} /></label>
        <label>Target URL (optional)<input placeholder="https://brand.com/landing" onChange={e=>setResult(null) as any} name="targetUrl" /></label>
        <label>Metric Type
          <select value={metricType} onChange={e=>setMetricType(e.target.value as any)}>
            <option>VIEWS</option>
            <option>CLICKS</option>
            <option>INTERACTIONS</option>
            <option>CONVERSIONS</option>
          </select>
        </label>
        <button disabled={busy} type="submit">{busy ? 'Creating...' : 'Create'}</button>
      </form>
      {result && (
        <div style={{marginTop:16}}>
          <p>Created:</p>
          <pre style={{background:'#f6f6f6', padding:12}}>{JSON.stringify(result, null, 2)}</pre>
          <a href={`/campaigns/${result.id}`}>View campaign →</a>
        </div>
      )}
    </section>
  );
}
