import { useEffect, useState } from 'react';

export const meta = {
  title: '27 · Subscribing to external sources (store, online, media query)',
  summary: 'Pattern: read current value → subscribe in effect → unsubscribe in cleanup. (Modern alternative: useSyncExternalStore)',
};

// a tiny global store (like a mini Redux/Zustand)
const store = {
  value: 0,
  listeners: new Set(),
  set(v) { this.value = v; this.listeners.forEach((l) => l()); },
  subscribe(l) { this.listeners.add(l); return () => this.listeners.delete(l); },
};

function useStore() {
  const [v, setV] = useState(store.value);
  useEffect(() => {
    setV(store.value); // catch updates that happened between render and subscribe
    return store.subscribe(() => setV(store.value));
  }, []);
  return v;
}

function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

const Reader = ({ name }) => <div className="box">{name} sees store.value = <b>{useStore()}</b></div>;

export default function ExternalSources() {
  const online = useOnlineStatus();
  const narrow = useMediaQuery('(max-width: 700px)');
  const dark = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div className="card">
      <h3>Global store</h3>
      <Reader name="Component A" />
      <Reader name="Component B" />
      <button onClick={() => store.set(store.value + 1)}>store.set(+1)</button>

      <h3>Browser state</h3>
      <p>Network: {online ? '🟢 online' : '🔴 offline'} (toggle "Offline" in DevTools → Network)</p>
      <p>Viewport ≤ 700px: <b>{String(narrow)}</b> · OS dark mode: <b>{String(dark)}</b></p>
    </div>
  );
}
