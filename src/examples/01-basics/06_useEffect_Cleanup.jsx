import { useEffect, useState } from 'react';

export const meta = {
  title: '06 · useEffect: cleanup function',
  summary: 'Return a function to undo what the effect started: timers, listeners, subscriptions.',
};

function Ticker() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    console.log('Ticker: setup → setInterval');
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => {
      console.log('Ticker: cleanup → clearInterval');
      clearInterval(id);
    };
  }, []);
  return <h3>⏱ Ticker: {secs}s</h3>;
}

function MouseTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove); // without this → leak, even after unmount
  }, []);
  return <p>🖱 Mouse: {pos.x}, {pos.y}</p>;
}

export default function Cleanup() {
  const [show, setShow] = useState(true);
  return (
    <div className="card">
      <button onClick={() => setShow((s) => !s)}>{show ? 'Unmount' : 'Mount'} children</button>
      {show && <Ticker />}
      {show && <MouseTracker />}
      <p className="muted">Cleanup runs (1) before the effect re-runs, and (2) when the component unmounts. Watch the console.</p>
    </div>
  );
}
