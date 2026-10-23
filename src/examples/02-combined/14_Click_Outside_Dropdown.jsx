import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '14 · Dropdown: close on outside click & Escape',
  summary: 'A ref identifies "inside"; document listeners are added only while the menu is open.',
};

export default function Dropdown() {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState('Pick a framework');
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return; // no listeners while closed
    const onDown = (e) => { if (!wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="card" style={{ minHeight: 220 }}>
      <div className="dd" ref={wrapRef}>
        <button onClick={() => setOpen((o) => !o)}>{choice} ▾</button>
        {open && (
          <div className="dd-menu">
            {['React', 'Vue', 'Svelte', 'Angular'].map((f) => (
              <div key={f} onClick={() => { setChoice(f); setOpen(false); }}>{f}</div>
            ))}
          </div>
        )}
      </div>
      <p className="muted">Click anywhere else, or press Esc, to close.</p>
    </div>
  );
}
