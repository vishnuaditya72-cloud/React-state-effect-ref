import { useEffect, useState } from 'react';

export const meta = {
  title: '10 · Fetching data (loading / error / abort)',
  summary: 'The canonical data-fetching effect: re-fetch when a dependency changes, abort the old request.',
};

export default function FetchData() {
  const [userId, setUserId] = useState(1);
  const [reload, setReload] = useState(0); // bump to force a refetch
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return; // we cancelled it on purpose
        setState({ data: null, loading: false, error: err.message });
      });

    return () => controller.abort(); // user switched quickly → cancel the stale request
  }, [userId, reload]);

  return (
    <div className="card">
      <div className="row">
        {[1, 2, 3, 4, 5, 999].map((id) => (
          <button key={id} className={id === userId ? 'primary' : ''} onClick={() => setUserId(id)}>
            user {id}{id === 999 ? ' (404)' : ''}
          </button>
        ))}
        <button onClick={() => setReload((r) => r + 1)}>↻ Reload</button>
      </div>
      {state.loading && <p>Loading…</p>}
      {state.error && <p className="err">Error: {state.error}</p>}
      {state.data && (
        <div className="box">
          <b>{state.data.name}</b> · {state.data.email}
          <div className="muted">{state.data.company.name} — {state.data.address.city}</div>
        </div>
      )}
      <p className="muted">Needs internet (jsonplaceholder.typicode.com). Click users quickly and watch the Network tab: old requests are cancelled.</p>
    </div>
  );
}
