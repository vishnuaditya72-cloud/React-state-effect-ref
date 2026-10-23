import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '22 · Undo / redo with debounced history + keyboard shortcuts',
  summary: 'History as one state object, a ref for the debounce timer, an effect for global shortcuts.',
};

export default function UndoRedo() {
  const [history, setHistory] = useState({ past: [], present: '', future: [] });
  const [draft, setDraft] = useState('');
  const timer = useRef(null);

  const commit = (v) => setHistory((h) => (v === h.present ? h : { past: [...h.past, h.present], present: v, future: [] }));
  const undo = () => { clearTimeout(timer.current); setHistory((h) => h.past.length ? { past: h.past.slice(0, -1), present: h.past.at(-1), future: [h.present, ...h.future] } : h); };
  const redo = () => { clearTimeout(timer.current); setHistory((h) => h.future.length ? { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) } : h); };

  // keep the textarea in sync when undo/redo changes `present`
  useEffect(() => { setDraft(history.present); }, [history.present]);

  function onChange(e) {
    const v = e.target.value;
    setDraft(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(v), 500); // one history entry per pause, not per keystroke
  }

  // undo/redo only use updater functions + a ref, so this [] effect never goes stale
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if (k === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(timer.current); };
  }, []);

  return (
    <div className="card">
      <textarea value={draft} onChange={onChange} placeholder="Type, pause, type… then Ctrl+Z / Ctrl+Y" />
      <div className="row">
        <button onClick={undo} disabled={!history.past.length}>↶ Undo</button>
        <button onClick={redo} disabled={!history.future.length}>↷ Redo</button>
        <span className="muted">{history.past.length} past · {history.future.length} future</span>
      </div>
    </div>
  );
}
