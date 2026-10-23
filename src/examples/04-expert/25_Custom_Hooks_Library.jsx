import { useRef, useState } from 'react';
import {
  useToggle, useDebounce, useLocalStorage, useEventListener,
  useOnClickOutside, useFetch, usePrevious, useInterval, useWindowSize,
} from '../../hooks/index.js';

export const meta = {
  title: '25 · A reusable custom-hooks library (src/hooks/index.js)',
  summary: 'Extract state + effect + ref logic into hooks. Open src/hooks/index.js and read each one.',
};

function Toggle() {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>useToggle: {on ? 'ON' : 'OFF'}</button>;
}

function Persisted() {
  const [name, setName] = useLocalStorage('lab:name', '');
  return <input value={name} onChange={(e) => setName(e.target.value)} placeholder="useLocalStorage (refresh!)" />;
}

function Debounced() {
  const [q, setQ] = useState('');
  const d = useDebounce(q, 500);
  return <div><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="useDebounce" /> <code>{d}</code></div>;
}

function Keys() {
  const [key, setKey] = useState('–');
  useEventListener('keydown', (e) => setKey(e.key)); // handler may change every render; listener is added once
  return <p>useEventListener — last key: <b>{key}</b></p>;
}

function Popover() {
  const [open, toggle, setOpen] = useToggle();
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));
  return (
    <div className="dd" ref={ref}>
      <button onClick={toggle}>useOnClickOutside ▾</button>
      {open && <div className="dd-menu"><div>Click outside to close</div></div>}
    </div>
  );
}

function Todo() {
  const [id, setId] = useState(1);
  const { data, loading, error, refetch } = useFetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return (
    <div>
      <button onClick={() => setId((i) => i + 1)}>next todo</button> <button onClick={refetch}>refetch</button>
      <p>useFetch → {loading ? 'loading…' : error ? <span className="err">{error}</span> : data?.title}</p>
    </div>
  );
}

function Clock() {
  const [n, setN] = useState(0);
  const prev = usePrevious(n);
  useInterval(() => setN(n + 1), 1000);
  return <p>useInterval + usePrevious: {n} (prev {String(prev)})</p>;
}

export default function Library() {
  const { w, h } = useWindowSize();
  return (
    <div className="card">
      <div className="row"><Toggle /><Persisted /><Debounced /></div>
      <Keys />
      <div className="row" style={{ minHeight: 70 }}><Popover /></div>
      <Todo />
      <Clock />
      <p>useWindowSize: {w} × {h}</p>
    </div>
  );
}
