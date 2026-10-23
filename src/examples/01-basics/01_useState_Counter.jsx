import { useState } from 'react';

export const meta = {
  title: '01 · useState: the counter',
  summary: 'State is memory that survives re-renders and triggers a new render when it changes.',
};

export default function Counter() {
  const [count, setCount] = useState(0); // [currentValue, setterFunction] = useState(initialValue)
  let plain = 0; // a normal variable is re-created on every render and never updates the screen

  console.log('RENDER → count =', count);

  return (
    <div className="card">
      <h3>count = {count}</h3>
      <div className="row">
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button onClick={() => setCount(count - 1)}>-1</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>

      <h3>plain variable = {plain}</h3>
      <button
        onClick={() => {
          plain++;
          console.log('plain is now', plain, '— but the screen did NOT change');
        }}
      >
        plain++
      </button>

      <p className="muted">
        Rule 1: change UI → call the setter. Rule 2: every setter call schedules a re-render (watch the console).
      </p>
    </div>
  );
}
