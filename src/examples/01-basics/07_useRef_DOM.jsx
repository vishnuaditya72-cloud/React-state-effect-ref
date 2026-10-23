import { useRef, useState } from 'react';

export const meta = {
  title: '07 · useRef: reaching DOM elements',
  summary: 'ref.current points to the real DOM node: focus, select, scroll, measure — without causing re-renders.',
};

export default function RefDom() {
  const inputRef = useRef(null);
  const boxRef = useRef(null);
  const bottomRef = useRef(null);
  const uncontrolled = useRef(null);
  const [size, setSize] = useState(null);
  const [submitted, setSubmitted] = useState('');

  return (
    <div className="card">
      <h3>Focus / select</h3>
      <div className="row">
        <input ref={inputRef} defaultValue="Hello ref" />
        <button onClick={() => inputRef.current.focus()}>Focus</button>
        <button onClick={() => inputRef.current.select()}>Select text</button>
        <button onClick={() => inputRef.current.blur()}>Blur</button>
      </div>

      <h3>Measure</h3>
      <div ref={boxRef} className="box" style={{ width: '60%', padding: 20 }}>Measure me</div>
      <button onClick={() => { const r = boxRef.current.getBoundingClientRect(); setSize({ w: Math.round(r.width), h: Math.round(r.height) }); }}>
        Measure
      </button>
      {size && <span> {size.w} × {size.h}px</span>}

      <h3>Uncontrolled input (read value only when needed)</h3>
      <div className="row">
        <input ref={uncontrolled} placeholder="type, no state per keystroke" />
        <button onClick={() => setSubmitted(uncontrolled.current.value)}>Read value</button>
        <span>→ {submitted}</span>
      </div>

      <h3>Scroll</h3>
      <div className="scroller">
        {Array.from({ length: 20 }, (_, i) => <div key={i}>Row {i + 1}</div>)}
        <div ref={bottomRef} className="good">⬇ bottom</div>
      </div>
      <button onClick={() => bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}>Scroll to bottom</button>
    </div>
  );
}
