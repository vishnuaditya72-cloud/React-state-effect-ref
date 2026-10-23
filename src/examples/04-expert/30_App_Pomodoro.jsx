import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '30 · Mini app: Pomodoro timer (all 3 hooks working together)',
  summary: 'Interval effect, title sync, localStorage persistence, keyboard shortcut, beep, refs for DOM + audio.',
};

const BASE = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
const dur = (mode, demo) => (demo ? Math.round(BASE[mode] / 60) : BASE[mode]); // demo = 1 minute → 1 second

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    o.frequency.value = 880; o.connect(ctx.destination); o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, 300);
  } catch { /* audio blocked */ }
}

export default function Pomodoro() {
  const [mode, setMode] = useState('focus');
  const [demo, setDemo] = useState(true);
  const [left, setLeft] = useState(dur('focus', true));
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(() => Number(localStorage.getItem('lab:pomodoros') || 0));
  const startBtn = useRef(null);

  // 1) the ticking
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [running]);

  // 2) reaching zero
  useEffect(() => {
    if (left === 0 && running) {
      setRunning(false);
      beep();
      if (mode === 'focus') setSessions((n) => n + 1);
    }
  }, [left, running, mode]);

  // 3) sync the tab title
  useEffect(() => {
    const mm = String(Math.floor(left / 60)).padStart(2, '0');
    const ss = String(left % 60).padStart(2, '0');
    document.title = `${mm}:${ss} · ${mode}`;
    return () => { document.title = 'React Hooks Lab'; };
  }, [left, mode]);

  // 4) persist
  useEffect(() => { localStorage.setItem('lab:pomodoros', String(sessions)); }, [sessions]);

  // 5) space bar toggles
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) { e.preventDefault(); setRunning((r) => !r); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function switchMode(m, d = demo) { setMode(m); setLeft(dur(m, d)); setRunning(false); startBtn.current?.focus(); }

  const total = dur(mode, demo);
  return (
    <div className="card">
      <div className="row">
        {Object.keys(BASE).map((m) => <button key={m} className={m === mode ? 'primary' : ''} onClick={() => switchMode(m)}>{m}</button>)}
        <label><input type="checkbox" checked={demo} onChange={(e) => { setDemo(e.target.checked); switchMode(mode, e.target.checked); }} /> demo speed (1 min = 1 s)</label>
      </div>
      <h1 style={{ fontSize: 64, margin: '8px 0', fontVariantNumeric: 'tabular-nums' }}>
        {String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}
      </h1>
      <div className="bar"><div style={{ width: ((total - left) / total) * 100 + '%' }} /></div>
      <div className="row">
        <button ref={startBtn} className="primary" onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Start'} (Space)</button>
        <button onClick={() => switchMode(mode)}>Reset</button>
        <span>🍅 completed: <b>{sessions}</b></span>
        <button onClick={() => setSessions(0)}>clear</button>
      </div>
    </div>
  );
}
