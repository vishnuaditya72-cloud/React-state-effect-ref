// A small custom-hooks library built ONLY from useState + useEffect + useRef.
// Used by examples/04-expert/25_Custom_Hooks_Library.jsx
import { useEffect, useRef, useState } from 'react';

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle, setOn];
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

// ref that always holds the newest value → lets effects read fresh data without re-subscribing
export function useLatest(value) {
  const ref = useRef(value);
  useEffect(() => { ref.current = value; });
  return ref;
}

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw === null ? initial : JSON.parse(raw); } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }, [key, value]);
  return [value, setValue];
}

export function useEventListener(type, handler, target = window) {
  const saved = useLatest(handler);
  useEffect(() => {
    const listener = (e) => saved.current(e);
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
  }, [type, target, saved]);
}

export function useOnClickOutside(ref, handler) {
  useEventListener('mousedown', (e) => {
    if (ref.current && !ref.current.contains(e.target)) handler(e);
  }, document);
}

export function useInterval(callback, delay) {
  const saved = useLatest(callback);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay, saved]);
}

export function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: !!url, error: null });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(url, { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => { if (err.name !== 'AbortError') setState({ data: null, loading: false, error: err.message }); });
    return () => controller.abort();
  }, [url, tick]);
  return { ...state, refetch: () => setTick((t) => t + 1) };
}

export function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEventListener('resize', () => setSize({ w: window.innerWidth, h: window.innerHeight }));
  return size;
}
