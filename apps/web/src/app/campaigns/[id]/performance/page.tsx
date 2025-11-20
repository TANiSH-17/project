async function fetchPerf(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}/performance`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function PerfPage({ params }: { params: { id: string } }) {
  const perf = await fetchPerf(params.id);
  if (!perf) return <p>Not found</p>;
  return (
    <section>
      <h1>Campaign Performance</h1>
      <div>Spend to date: ${(perf.spendToDate/100).toFixed(2)} {perf.currency || 'USD'}</div>
      <div>Engagement units: {perf.viewsOrClicks}</div>
      <div>Effective CPM: ${(perf.cpmEffectiveCents/100).toFixed(2)}</div>
      <div>Budget remaining: ${(perf.budgetRemaining/100).toFixed(2)}</div>
      <div>Status: {perf.status}</div>
    </section>
  );
}
