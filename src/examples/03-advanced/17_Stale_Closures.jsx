import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '17 · Stale closures (the #1 hooks bug) and 4 fixes',
  summary: 'A function captures the values of the render it was created in. Effects with [] keep that old snapshot.',
};

function Broken() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000); // ❌ `count` is forever 0 in this closure
    return () => clearInterval(id);
  }, []);
  return <p>❌ Broken: {count} (stuck at 1)</p>;
}

function FixUpdater() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000); // ✅ fix 1: updater needs no outer value
    return () => clearInterval(id);
  }, []);
  return <p>✅ Fix 1 (updater function): {count}</p>;
}

function FixDeps() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000); // ✅ fix 2: honest deps → interval re-created each tick
    return () => clearInterval(id);
  }, [count]);
  return <p>✅ Fix 2 (dependency array): {count}</p>;
}

function FixRef() {
  const [count, setCount] = useState(0);
  const latest = useRef(count);
  useEffect(() => { latest.current = count; }); // ✅ fix 3: a ref always holds the newest value
  const [msg, setMsg] = useState('');
  function check() {
    setTimeout(() => setMsg(`captured state = ${count}  |  ref.current = ${latest.current}`), 3000);
  }
  return (
    <div>
      <p>✅ Fix 3 (ref for "latest value"): count = {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <button onClick={check}>Report in 3s</button>
      <div className="muted">Click Report, then +1 several times. {msg}</div>
    </div>
  );
}

export default function StaleClosures() {
  return (
    <div className="card">
      <Broken />
      <FixUpdater />
      <FixDeps />
      <FixRef />
      <p className="muted">Fix 4 is restructuring so the effect doesn't need the value at all (see example 18: useInterval).</p>
    </div>
  );
}
