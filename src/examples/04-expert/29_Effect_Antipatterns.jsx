import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '29 · "You might not need an effect" (anti-patterns)',
  summary: 'Effects are for syncing with the outside world. Derived data and user events do NOT need effects.',
};

const ITEMS = ['apple', 'apricot', 'banana', 'blueberry', 'cherry', 'grape', 'mango', 'orange'];

function BadFilter() {
  const [q, setQ] = useState('');
  const [filtered, setFiltered] = useState(ITEMS);
  const renders = useRef(0); renders.current += 1;
  useEffect(() => { setFiltered(ITEMS.filter((i) => i.includes(q))); }, [q]); // ❌ extra render pass + extra state
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="❌ effect-based filter" />
      <span className="muted"> render passes: {renders.current}</span>
      <div>{filtered.join(', ')}</div>
    </div>
  );
}

function GoodFilter() {
  const [q, setQ] = useState('');
  const renders = useRef(0); renders.current += 1;
  const filtered = ITEMS.filter((i) => i.includes(q)); // ✅ derive during render
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="✅ derived filter" />
      <span className="muted"> render passes: {renders.current}</span>
      <div>{filtered.join(', ')}</div>
    </div>
  );
}

// reset state when a prop changes
function DraftBad({ userId }) {
  const [text, setText] = useState('');
  useEffect(() => { setText(''); }, [userId]); // ❌ flashes the old draft for one frame
  return <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`❌ draft for user ${userId}`} />;
}
function DraftGood({ userId }) {
  const [text, setText] = useState('');
  return <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`✅ draft for user ${userId}`} />;
}

export default function Antipatterns() {
  const [userId, setUserId] = useState(1);
  const [sent, setSent] = useState(0);
  return (
    <div className="card">
      <h3>1 · Derived data</h3>
      <BadFilter />
      <div style={{ height: 10 }} />
      <GoodFilter />

      <h3>2 · Reset state on prop change → use key</h3>
      <button onClick={() => setUserId((u) => u + 1)}>switch to user {userId + 1}</button>
      <div className="row">
        <DraftBad userId={userId} />
        <DraftGood key={userId} userId={userId} /> {/* key change = fresh component, state reset for free */}
      </div>

      <h3>3 · User events belong in handlers</h3>
      <button onClick={() => { setSent((n) => n + 1); console.log('analytics: clicked'); }}>
        Send ({sent}) — side effect runs in the click handler, not in an effect watching `sent`
      </button>

      <p className="muted">
        Checklist before writing useEffect: Is it syncing with something external (network, DOM API, timer, subscription)? If not,
        compute it during render or do it in the event handler.
      </p>
    </div>
  );
}
