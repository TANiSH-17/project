'use client';
import { useState } from 'react';
import { apiFetch } from '../../../../lib/api';

export default function SubmitContentPage({ params }: { params: { id: string } }) {
  const [postUrl, setPostUrl] = useState('https://youtube.com/watch?v=dQw4w9WgXcQ');
  const [platform, setPlatform] = useState('youtube');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await apiFetch(`/participants/${params.id}/submissions`, {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ platform, postUrl })
      });
      setResult(await res.json());
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h1>Submit Content</h1>
      <form onSubmit={submit} style={{display:'grid', gap:12, maxWidth:520}}>
        <label>Platform
          <select value={platform} onChange={e=>setPlatform(e.target.value)}>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="x">X</option>
          </select>
        </label>
        <label>Post URL<input value={postUrl} onChange={e=>setPostUrl(e.target.value)} /></label>
        <button disabled={busy} type="submit">{busy ? 'Submitting...' : 'Submit'}</button>
      </form>
      {result && (
        <div style={{marginTop:16}}>
          <p>Submission created.</p>
          <pre style={{background:'#f6f6f6', padding:12}}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
