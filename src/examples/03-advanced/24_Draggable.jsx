import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '24 · Draggable box (listeners only while dragging)',
  summary: 'State flag turns an effect on/off. A ref stores the grab offset that never needs to render.',
};

const SIZE = 90;

export default function Draggable() {
  const [pos, setPos] = useState({ x: 60, y: 40 });
  const [dragging, setDragging] = useState(false);
  const areaRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  function onPointerDown(e) {
    const r = e.currentTarget.getBoundingClientRect();
    offset.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    setDragging(true);
  }

  useEffect(() => {
    if (!dragging) return;
    const area = areaRef.current.getBoundingClientRect();
    const move = (e) => {
      const x = Math.min(Math.max(e.clientX - area.left - offset.current.x, 0), area.width - SIZE);
      const y = Math.min(Math.max(e.clientY - area.top - offset.current.y, 0), area.height - SIZE);
      setPos({ x, y });
    };
    const up = () => setDragging(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [dragging]);

  return (
    <div className="card">
      <div ref={areaRef} style={{ position: 'relative', height: 280, border: '1px dashed #2a2f4d', borderRadius: 8, overflow: 'hidden', userSelect: 'none' }}>
        <div
          onPointerDown={onPointerDown}
          style={{ position: 'absolute', left: pos.x, top: pos.y, width: SIZE, height: SIZE, borderRadius: 12, cursor: dragging ? 'grabbing' : 'grab', background: dragging ? '#4ade80' : '#7c9cff', display: 'grid', placeItems: 'center', color: '#0b0e1f', fontWeight: 700, touchAction: 'none' }}
        >
          drag me
        </div>
      </div>
      <p className="muted">x: {Math.round(pos.x)} · y: {Math.round(pos.y)} · dragging: {String(dragging)}</p>
    </div>
  );
}
