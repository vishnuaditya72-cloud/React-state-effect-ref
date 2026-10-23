import { useEffect, useMemo, useState } from 'react';

// Vite auto-imports every file inside /examples — just drop a new .jsx file there.
// Each example exports: default component + `meta` ({ title, summary }).
const modules = import.meta.glob('./examples/**/*.jsx', { eager: true });
const sources = import.meta.glob('./examples/**/*.jsx', { query: '?raw', import: 'default', eager: true });

const LEVELS = {
  '01-basics': 'Level 1 · Basics (one hook at a time)',
  '02-combined': 'Level 2 · Combining the 3 hooks',
  '03-advanced': 'Level 3 · Advanced patterns',
  '04-expert': 'Level 4 · Expert, custom hooks & real apps',
};

const examples = Object.keys(modules)
  .sort()
  .map((path) => {
    const [, , folder, file] = path.split('/');
    const id = file.replace('.jsx', '');
    const mod = modules[path];
    return { path, id, folder, Component: mod.default, meta: mod.meta || { title: id, summary: '' } };
  });

export default function App() {
  const [activeId, setActiveId] = useState(() => {
    const hash = window.location.hash.slice(1);
    return examples.some((e) => e.id === hash) ? hash : examples[0].id;
  });
  const [showSource, setShowSource] = useState(false);

  useEffect(() => {
    window.location.hash = activeId; // remember where you were on refresh
    setShowSource(false);
  }, [activeId]);

  const groups = useMemo(
    () => Object.keys(LEVELS).map((f) => ({ folder: f, label: LEVELS[f], items: examples.filter((e) => e.folder === f) })),
    []
  );

  const active = examples.find((e) => e.id === activeId);
  const Active = active.Component;

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>⚛️ React Hooks Lab</h1>
        <div className="muted">useState · useEffect · useRef</div>
        {groups.map((g) => (
          <div key={g.folder}>
            <h2>{g.label}</h2>
            {g.items.map((e) => (
              <button key={e.id} className={'nav' + (e.id === activeId ? ' active' : '')} onClick={() => setActiveId(e.id)}>
                {e.id.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <main className="main">
        <h2>{active.meta.title}</h2>
        <p className="muted">{active.meta.summary}</p>
        <div className="row">
          <button onClick={() => setShowSource((s) => !s)}>{showSource ? 'Hide' : 'Show'} source code</button>
          <span className="muted">File: src/{active.path.slice(2)} · open DevTools console for logs</span>
        </div>
        {showSource && <pre className="src">{sources[active.path]}</pre>}
        {/* key = remount from scratch when you switch examples */}
        <Active key={active.id} />
      </main>
    </div>
  );
}
