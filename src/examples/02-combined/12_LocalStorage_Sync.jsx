import { useEffect, useState } from 'react';

export const meta = {
  title: '12 · Persist state in localStorage (+ cross-tab sync)',
  summary: 'Lazy init reads storage once, an effect writes on change, a storage listener syncs other tabs.',
};

const KEY = 'hooks-lab:notes';

export default function LocalStorageSync() {
  const [text, setText] = useState(() => {
    try { return localStorage.getItem(KEY) ?? ''; } catch { return ''; }
  });
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, text); setSavedAt(new Date().toLocaleTimeString()); } catch { /* private mode */ }
  }, [text]);

  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setText(e.newValue ?? ''); };
    window.addEventListener('storage', onStorage); // fires in OTHER tabs only
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="card">
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type, refresh the page, open a second tab…" />
      <p className="muted">Saved at {savedAt}. Open this page in two tabs and type in one.</p>
      <button onClick={() => setText('')}>Clear</button>
    </div>
  );
}
