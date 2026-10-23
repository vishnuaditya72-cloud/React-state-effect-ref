import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '19 · Infinite scroll (IntersectionObserver)',
  summary: 'A ref marks a sentinel element; an effect observes it and bumps the page number.',
};

const PAGE = 15;
const fakeFetch = (page) =>
  new Promise((resolve) =>
    setTimeout(() => resolve(Array.from({ length: PAGE }, (_, i) => `Item #${page * PAGE + i + 1}`)), 700)
  );

export default function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const boxRef = useRef(null);
  const sentinelRef = useRef(null);

  // load whenever `page` changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fakeFetch(page).then((next) => {
      if (cancelled) return;
      setItems((prev) => [...prev, ...next]);
      setLoading(false);
      if (page >= 4) setDone(true);
    });
    return () => { cancelled = true; };
  }, [page]);

  // observe the sentinel; re-created when loading/done change so it re-checks visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !loading && !done) setPage((p) => p + 1); },
      { root: boxRef.current, rootMargin: '80px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, done]);

  return (
    <div className="card">
      <div className="scroller" ref={boxRef} style={{ height: 300 }}>
        {items.map((t) => <div key={t} style={{ padding: '6px 0', borderBottom: '1px solid #2a2f4d' }}>{t}</div>)}
        <div ref={sentinelRef} className="muted">{done ? '— end —' : loading ? 'Loading…' : ' '}</div>
      </div>
      <p className="muted">{items.length} items loaded (pages 0–4).</p>
    </div>
  );
}
