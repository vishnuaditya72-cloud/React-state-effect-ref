import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '18 · Your first custom hooks: usePrevious & useInterval',
  summary: 'Custom hooks are plain functions that call hooks. Refs + effects make a "latest callback" pattern.',
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

// Dan Abramov's useInterval: callback always fresh, interval only re-created when delay changes.
function useInterval(callback, delay) {
  const saved = useRef(callback);
  useEffect(() => { saved.current = callback; });
  useEffect(() => {
    if (delay === null) return; // null = paused
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default function Demo() {
  const [n, setN] = useState(10);
  const prev = usePrevious(n);

  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  useInterval(() => setCount(count + 1), delay); // reads `count` directly — no stale closure!

  return (
    <div className="card">
      <h3>usePrevious</h3>
      <div className="row">
        <button onClick={() => setN(n - 1)}>-</button>
        <b>{n}</b>
        <button onClick={() => setN(n + 1)}>+</button>
        <span>previous: {String(prev)} · change: {prev === undefined ? '–' : n - prev}</span>
      </div>

      <h3>useInterval (count = {count})</h3>
      <div className="row">
        <button onClick={() => setDelay(1000)}>1 s</button>
        <button onClick={() => setDelay(200)}>0.2 s</button>
        <button onClick={() => setDelay(null)}>Pause</button>
        <span className="muted">delay = {String(delay)}</span>
      </div>
    </div>
  );
}
