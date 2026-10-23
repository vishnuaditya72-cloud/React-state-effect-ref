import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '21 · Canvas animation loop (requestAnimationFrame)',
  summary: 'Fast-changing data lives in refs (not state). State only controls pause/speed.',
};

const makeBall = (x, y) => ({ x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, r: 8 + Math.random() * 10, c: `hsl(${Math.random() * 360} 80% 60%)` });

export default function CanvasAnimation() {
  const canvasRef = useRef(null);
  const ballsRef = useRef(null);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(2);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]); // loop reads the latest speed without restarting

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ballsRef.current) ballsRef.current = Array.from({ length: 10 }, () => makeBall(Math.random() * 500 + 50, Math.random() * 200 + 50));

    let raf;
    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const b of ballsRef.current) {
        b.x += b.vx * speedRef.current;
        b.y += b.vy * speedRef.current;
        if (b.x < b.r || b.x > canvas.width - b.r) b.vx *= -1;
        if (b.y < b.r || b.y > canvas.height - b.r) b.vy *= -1;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = b.c; ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    if (running) raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  function addBall(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 600;
    const y = ((e.clientY - rect.top) / rect.height) * 300;
    ballsRef.current.push(makeBall(x, y));
  }

  return (
    <div className="card">
      <canvas ref={canvasRef} width={600} height={300} onClick={addBall} style={{ width: '100%', background: '#0b0d1a', borderRadius: 8 }} />
      <div className="row">
        <button onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Play'}</button>
        <label>speed {speed} <input type="range" min="0" max="6" step="0.5" value={speed} onChange={(e) => setSpeed(+e.target.value)} /></label>
        <span className="muted">Click the canvas to add a ball (stored in a ref → no re-render).</span>
      </div>
    </div>
  );
}
