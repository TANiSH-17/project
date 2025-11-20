import { use } from 'react';

async function fetchCampaigns() {
  // In dev, point to local API
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/campaigns', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default function CampaignsPage() {
  const campaigns = use(fetchCampaigns());
  return (
    <section>
      <h1>Campaigns</h1>
      {campaigns.length === 0 && <p>No campaigns yet.</p>}
      <ul>
        {campaigns.map((c: any) => (
          <li key={c.id} style={{marginBottom:12}}>
            <a href={`/campaigns/${c.id}`}><strong>{c.title}</strong></a>
            <div>Rate: ${(c.ratePerThousand/100).toFixed(2)} per 1k {c.metricType.toLowerCase()}</div>
            <div>Budget remaining: ${(c.budgetRemaining/100).toFixed(2)} {c.currency}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
