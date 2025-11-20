'use client';
import React, { useEffect, useState } from 'react';

export default function BillingPage() {
  const [email, setEmail] = useState('');
  const [onboarding, setOnboarding] = useState<string | null>(null);

  useEffect(() => { setEmail(localStorage.getItem('email') || ''); }, []);

  async function onboardStripe() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/connect/onboard`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
    });
    const data = await res.json();
    setOnboarding(data.onboardingUrl);
    if (data.onboardingUrl) window.location.href = data.onboardingUrl;
  }

  return (
    <section>
      <h1>Billing</h1>
      {!email && <p>Set your email in Settings first.</p>}
      <button onClick={onboardStripe} disabled={!email}>Connect Stripe</button>
      {onboarding && <p>Redirecting to Stripe onboarding...</p>}
    </section>
  );
}
