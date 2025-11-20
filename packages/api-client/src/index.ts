export type Config = { baseUrl: string; getHeaders?: () => Record<string, string> };

async function http<T>(config: Config, path: string, init?: RequestInit): Promise<T> {
  const headers = { 'Content-Type': 'application/json', ...(config.getHeaders?.() || {}), ...(init?.headers || {}) } as any;
  const res = await fetch(`${config.baseUrl}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// Types
export type Campaign = { id: string; title: string; brief: string; metricType: 'VIEWS'|'CLICKS'|'INTERACTIONS'|'CONVERSIONS'; ratePerThousand: number; currency: string; budgetRemaining: number; status: string };
export type Application = { id: string; campaignId: string; userId: string; status: string };
export type Participation = { id: string; campaignId: string; userId: string; status: string; trackingLink: string };
export type Metrics = { metricType: 'CLICKS'|'VIEWS'; clicks?: number; views?: number; ratePerThousand: number; currency: string; earningsCents: number };

// Endpoints
export const Api = (config: Config) => ({
  campaigns: {
    list: () => http<Campaign[]>(config, '/campaigns'),
    get: (id: string) => http<Campaign>(config, `/campaigns/${id}`),
    create: (payload: any) => http<Campaign>(config, '/campaigns', { method: 'POST', body: JSON.stringify(payload) }),
    performance: (id: string) => http<any>(config, `/campaigns/${id}/performance`),
  },
  applications: {
    apply: (campaignId: string, payload: { email: string; message?: string }) => http<Application>(config, `/campaigns/${campaignId}/applications`, { method: 'POST', body: JSON.stringify(payload) }),
    listForCampaign: (campaignId: string) => http<any[]>(config, `/campaigns/${campaignId}/applications`),
    approve: (id: string) => http<any>(config, `/applications/${id}/approve`, { method: 'POST' }),
    listAll: () => http<any[]>(config, '/applications'),
  },
  participants: {
    get: (id: string) => http<Participation>(config, `/participants/${id}`),
    submit: (id: string, payload: { platform: string; postUrl: string; postId?: string; notes?: string }) => http<any>(config, `/participants/${id}/submissions`, { method: 'POST', body: JSON.stringify(payload) }),
    metrics: (id: string) => http<Metrics>(config, `/participants/${id}/metrics`),
    accrue: (id: string) => http<any>(config, `/participants/${id}/accrue`, { method: 'POST' }),
    lock: (id: string) => http<any>(config, `/participants/${id}/lock`, { method: 'POST' }),
  },
  users: {
    applications: (email: string) => http<any[]>(config, `/users/${encodeURIComponent(email)}/applications`),
    participations: (email: string) => http<any[]>(config, `/users/${encodeURIComponent(email)}/participations`),
  },
  payouts: {
    list: (email?: string) => http<any[]>(config, `/payouts${email ? `?email=${encodeURIComponent(email)}` : ''}`),
    create: (email: string) => http<any>(config, `/payouts`, { method: 'POST', body: JSON.stringify({ email }) }),
  },
  payments: {
    connectOnboard: (email: string) => http<any>(config, `/payments/connect/onboard`, { method: 'POST', body: JSON.stringify({ email }) }),
  }
});
