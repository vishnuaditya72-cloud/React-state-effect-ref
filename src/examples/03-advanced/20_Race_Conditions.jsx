import { useEffect, useState } from 'react';

export const meta = {
  title: '20 · Race conditions: out-of-order responses',
  summary: 'Slow old request can finish AFTER a fast new one. Cleanup flag (or AbortController) fixes it.',
};

// longer query → FASTER response, so replies arrive out of order
const fakeSearch = (q) =>
  new Promise((resolve) => setTimeout(() => resolve(`results for "${q}"`), Math.max(1800 - q.length * 300, 200)));

function Buggy({ q }) {
  const [result, setResult] = useState('');
  useEffect(() => {
    if (!q) return;
    fakeSearch(q).then(setResult); // ❌ no protection
  }, [q]);
  return <p>❌ shows: <b>{result}</b></p>;
}

function Fixed({ q }) {
  const [result, setResult] = useState('');
  useEffect(() => {
    if (!q) return;
    let ignore = false;
    fakeSearch(q).then((r) => { if (!ignore) setResult(r); }); // ✅
    return () => { ignore = true; }; // runs when q changes → the old response is ignored
  }, [q]);
  return <p>✅ shows: <b>{result}</b></p>;
}

export default function RaceConditions() {
  const [q, setQ] = useState('');
  return (
    <div className="card">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="type 'abc' quickly, then wait 2s" />
      <p className="muted">Current input: "{q}"</p>
      <Buggy q={q} />
      <Fixed q={q} />
    </div>
  );
}
