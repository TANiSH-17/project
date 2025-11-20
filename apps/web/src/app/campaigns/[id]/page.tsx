import { notFound } from 'next/navigation';

async function fetchCampaign(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function CampaignDetail({ params }: { params: { id: string } }) {
  const data = await fetchCampaign(params.id);
  if (!data) return notFound();
  return (
    <section>
      <h1>{data.title}</h1>
      <p>{data.brief}</p>
      <div style={{marginTop:12}}>
        <div>Metric: {data.metricType}</div>
        <div>Rate: ${(data.ratePerThousand/100).toFixed(2)} per 1k {data.metricType?.toLowerCase?.()}</div>
        <div>Budget remaining: ${(data.budgetRemaining/100).toFixed(2)} {data.currency}</div>
        <div>Status: {data.status}</div>
      </div>
      <div style={{marginTop:16, display:'flex', gap:12}}>
        <a href={`/apply/${data.id}`}>Apply to this campaign →</a>
        <a href={`/campaigns/${data.id}/performance`}>View performance →</a>
      </div>
    </section>
  );
}
