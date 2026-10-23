import { useEffect, useState } from 'react';

export const meta = {
  title: '05 · useEffect: the dependency array',
  summary: 'Effects run AFTER render, to sync with something outside React (title, network, timers, DOM…).',
};

export default function EffectBasics() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    console.log('① no array   → runs after EVERY render');
  });

  useEffect(() => {
    console.log('② []         → runs once after the first render (mount)');
  }, []);

  useEffect(() => {
    console.log('③ [count]    → runs on mount + whenever count changes. count =', count);
  }, [count]);

  useEffect(() => {
    document.title = `Clicked ${count} times`; // a real "sync with outside world" effect
    return () => { document.title = 'React Hooks Lab'; };
  }, [count]);

  return (
    <div className="card">
      <p>Open the console, then click and type.</p>
      <button onClick={() => setCount((c) => c + 1)}>count: {count} (look at the browser tab title)</button>
      <div className="row">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="typing re-renders → only ① runs" />
      </div>
      <p className="muted">Rule: list every reactive value (props/state) that the effect reads inside the dependency array.</p>
    </div>
  );
}
