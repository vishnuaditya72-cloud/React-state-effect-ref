import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

export const meta = {
  title: '28 · Advanced refs: callback refs, ref maps, forwardRef',
  summary: 'Refs are not only for useRef(): callback refs run when a node attaches; refs can be passed to children.',
};

// child exposes a tiny imperative API to its parent
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inner = useRef(null);
  const [shake, setShake] = useState(false);
  useImperativeHandle(ref, () => ({
    focus: () => inner.current.focus(),
    clear: () => { inner.current.value = ''; },
    shake: () => { setShake(true); setTimeout(() => setShake(false), 400); },
  }));
  return <input ref={inner} {...props} style={{ outline: shake ? '2px solid #f87171' : undefined, transform: shake ? 'translateX(4px)' : 'none' }} />;
});

export default function RefsAdvanced() {
  // 1) callback ref: measure the moment the node exists
  const [height, setHeight] = useState(0);
  const measure = useCallback((node) => { if (node) setHeight(Math.round(node.getBoundingClientRect().height)); }, []);

  // 2) a Map of refs for a dynamic list
  const itemRefs = useRef(new Map());
  const items = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }));
  const scrollTo = (id) => itemRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // 3) child imperative handle
  const fancy = useRef(null);

  return (
    <div className="card">
      <h3>1 · Callback ref</h3>
      <div ref={measure} className="box" style={{ padding: 24 }}>I was measured on attach: {height}px tall</div>

      <h3>2 · Map of refs</h3>
      <div className="row">{[3, 8, 12].map((id) => <button key={id} onClick={() => scrollTo(id)}>go to {id}</button>)}</div>
      <div className="scroller" style={{ height: 120 }}>
        {items.map((it) => (
          <div key={it.id} ref={(node) => { node ? itemRefs.current.set(it.id, node) : itemRefs.current.delete(it.id); }} style={{ padding: '6px 0' }}>
            {it.label}
          </div>
        ))}
      </div>

      <h3>3 · forwardRef + useImperativeHandle</h3>
      <div className="row">
        <FancyInput ref={fancy} placeholder="child input" />
        <button onClick={() => fancy.current.focus()}>focus</button>
        <button onClick={() => fancy.current.clear()}>clear</button>
        <button onClick={() => fancy.current.shake()}>shake</button>
      </div>
      <p className="muted">Prefer props/state when possible; use imperative handles only for focus/scroll/animations/media.</p>
    </div>
  );
}
