import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '15 · Window size & scroll progress',
  summary: 'Subscribe to browser events in effects; throttle scroll with requestAnimationFrame + a ref flag.',
};

export default function ScrollResize() {
  const boxRef = useRef(null);
  const ticking = useRef(false);
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    const onScroll = () => {
      if (ticking.current) return; // already scheduled for this frame
      ticking.current = true;
      requestAnimationFrame(() => {
        const max = el.scrollHeight - el.clientHeight;
        setProgress(max ? (el.scrollTop / max) * 100 : 0);
        ticking.current = false;
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="card">
      <p>Window: {size.w} × {size.h} (resize the browser)</p>
      <div className="bar"><div style={{ width: progress + '%' }} /></div>
      <p>Scrolled {progress.toFixed(0)}%</p>
      <div className="scroller" ref={boxRef}>
        {Array.from({ length: 40 }, (_, i) => <p key={i}>Paragraph {i + 1} — scroll me.</p>)}
      </div>
    </div>
  );
}
