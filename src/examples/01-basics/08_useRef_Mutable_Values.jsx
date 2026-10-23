import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '08 · useRef: a mutable box that does NOT re-render',
  summary: 'State = value shown on screen. Ref = value you need to remember but never display directly.',
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]); // runs AFTER render → during render ref still has the old value
  return ref.current;
}

export default function RefMutable() {
  const [stateClicks, setStateClicks] = useState(0);
  const refClicks = useRef(0);
  const [, forceRender] = useState(0);

  const renders = useRef(0);
  useEffect(() => { renders.current += 1; }); // counts renders without causing any (starts at 2 in StrictMode dev)

  const [n, setN] = useState(0);
  const prev = usePrevious(n);

  const timeoutId = useRef(null);
  const [msg, setMsg] = useState('');
  useEffect(() => () => clearTimeout(timeoutId.current), []); // cleanup on unmount
  const start = () => { clearTimeout(timeoutId.current); setMsg('waiting 2s…'); timeoutId.current = setTimeout(() => setMsg('Hello after 2s!'), 2000); };
  const cancel = () => { clearTimeout(timeoutId.current); setMsg('cancelled'); };

  return (
    <div className="card">
      <h3>State vs ref</h3>
      <div className="row">
        <button onClick={() => setStateClicks((c) => c + 1)}>state clicks: {stateClicks}</button>
        <button onClick={() => { refClicks.current += 1; console.log('ref clicks =', refClicks.current); }}>
          ref clicks (screen frozen, see console)
        </button>
        <button onClick={() => forceRender((x) => x + 1)}>re-render → shows ref = {refClicks.current}</button>
      </div>

      <h3>Render counter</h3>
      <p>Renders (up to the previous one): {renders.current}</p>

      <h3>Previous value</h3>
      <button onClick={() => setN(n + 1)}>n = {n}</button> <span>previous = {String(prev)}</span>

      <h3>Remember a timer id</h3>
      <div className="row">
        <button onClick={start}>Start 2s timer</button>
        <button onClick={cancel}>Cancel</button>
        <span>{msg}</span>
      </div>
    </div>
  );
}
