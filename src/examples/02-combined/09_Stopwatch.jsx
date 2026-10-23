import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '09 · Stopwatch (state + effect + ref)',
  summary: 'useState holds what is shown, useEffect owns the interval, useRef remembers the start time.',
};

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [ms, setMs] = useState(0);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(0); // not displayed directly → ref, not state

  // The interval exists ONLY while running is true. Cleanup stops it on pause/unmount.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setMs(Date.now() - startRef.current), 10);
    return () => clearInterval(id);
  }, [running]);

  function toggle() {
    if (!running) startRef.current = Date.now() - ms; // resume from where we paused
    setRunning((r) => !r);
  }
  function reset() { setRunning(false); setMs(0); setLaps([]); }

  return (
    <div className="card">
      <h2 style={{ fontVariantNumeric: 'tabular-nums' }}>{(ms / 1000).toFixed(2)} s</h2>
      <div className="row">
        <button className="primary" onClick={toggle}>{running ? 'Pause' : 'Start'}</button>
        <button onClick={() => setLaps((l) => [...l, ms])} disabled={!running}>Lap</button>
        <button onClick={reset}>Reset</button>
      </div>
      <ol>{laps.map((l, i) => <li key={i}>{(l / 1000).toFixed(2)} s</li>)}</ol>
    </div>
  );
}
