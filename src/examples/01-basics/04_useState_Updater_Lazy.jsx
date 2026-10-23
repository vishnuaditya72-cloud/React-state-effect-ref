import { useState } from 'react';

export const meta = {
  title: '04 · useState: updater function, lazy init, batching',
  summary: 'setX(prev => next) when the new value depends on the old one; pass a function to useState for expensive init.',
};

function expensiveInit() {
  console.log('expensiveInit() ran');
  return Array.from({ length: 100000 }, (_, i) => i).reduce((a, b) => a + b, 0);
}

export default function UpdaterLazy() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [lazy] = useState(expensiveInit); // ✅ pass the FUNCTION → runs once (first render only)
  const [notLazy] = useState(expensiveInit()); // ❌ called on every render (watch the console), result ignored after the first
  const [renders, setRenders] = useState(0);

  return (
    <div className="card">
      <h3>Snapshot vs updater</h3>
      <p>Both buttons call the setter 3 times.</p>
      <div className="row">
        <button onClick={() => { setA(a + 1); setA(a + 1); setA(a + 1); }}>
          setA(a + 1) ×3 → a = {a}
        </button>
        <button onClick={() => { setB((x) => x + 1); setB((x) => x + 1); setB((x) => x + 1); }}>
          setB(x ⇒ x + 1) ×3 → b = {b}
        </button>
      </div>
      <p className="muted">
        Inside one event, <code>a</code> is a snapshot (same value each time) so +1 is applied once. The updater form
        queues the calls, so b goes up by 3. Updates are also batched into ONE re-render.
      </p>

      <h3>Lazy initialisation</h3>
      <p>lazy = {lazy}, notLazy = {notLazy}</p>
      <button onClick={() => setRenders((r) => r + 1)}>Force re-render ({renders}) — check the console</button>

      <h3>Same value = no re-render</h3>
      <button onClick={() => { console.log('setA(a) called — React bails out'); setA(a); }}>setA(a)</button>
    </div>
  );
}
