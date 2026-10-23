import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '31 · Mini app: typing speed test',
  summary: 'Ref focuses the input, an effect runs the countdown only after the first keystroke, WPM is derived.',
};

const TEXT = 'The quick brown fox jumps over the lazy dog while React renders another frame';
const DURATION = 30;

export default function TypingTest() {
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const inputRef = useRef(null);

  const finished = timeLeft === 0 || typed.length >= TEXT.length;

  useEffect(() => { inputRef.current.focus(); }, []);

  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [started, finished]);

  // derived values (never stored)
  const correct = [...typed].filter((c, i) => c === TEXT[i]).length;
  const elapsed = Math.max(DURATION - timeLeft, 1);
  const wpm = Math.round(correct / 5 / (elapsed / 60));
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;

  function onChange(e) {
    if (finished) return;
    if (!started) setStarted(true);
    setTyped(e.target.value.slice(0, TEXT.length));
  }
  function restart() {
    setTyped(''); setStarted(false); setTimeLeft(DURATION);
    setTimeout(() => inputRef.current.focus(), 0); // after the input is re-enabled
  }

  return (
    <div className="card">
      <h3>⏳ {timeLeft}s</h3>
      <p style={{ fontSize: 20, fontFamily: 'monospace' }}>
        {[...TEXT].map((c, i) => (
          <span key={i} className={i >= typed.length ? 'pending' : typed[i] === c ? 'good' : 'bad'}>{c}</span>
        ))}
      </p>
      <input ref={inputRef} value={typed} onChange={onChange} disabled={finished} style={{ width: '100%' }} placeholder="start typing…" />
      <p>WPM: <b>{wpm}</b> · accuracy: <b>{accuracy}%</b> {finished && <span className="good">· finished!</span>}</p>
      <button onClick={restart}>Restart</button>
    </div>
  );
}
