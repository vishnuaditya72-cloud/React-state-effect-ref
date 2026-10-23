import { useState } from 'react';

export const meta = {
  title: '03 · useState: arrays & objects (immutability)',
  summary: 'Never mutate state. Create a new array/object so React sees a new reference.',
};

export default function ArraysObjects() {
  const [items, setItems] = useState([
    { id: 1, text: 'Learn useState', done: true },
    { id: 2, text: 'Learn useEffect', done: false },
  ]);
  const [text, setText] = useState('');
  const [user, setUser] = useState({ name: 'Vishnu', address: { city: 'Kakinada', pin: '533001' } });

  const add = () => text.trim() && (setItems([...items, { id: Date.now(), text, done: false }]), setText('')); // spread = add
  const toggle = (id) => setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i))); // map = update
  const remove = (id) => setItems(items.filter((i) => i.id !== id)); // filter = delete

  function brokenMutate() {
    items.push({ id: Date.now(), text: 'MUTATED (bug)', done: false }); // ❌ mutates the existing array
    setItems(items); // same reference → React bails out, nothing re-renders
    console.log('array changed, but no re-render happened. Click anything else to see it appear.');
  }

  return (
    <div className="card">
      <h3>Array of objects</h3>
      <div className="row">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="new item" />
        <button onClick={add}>Add</button>
        <button onClick={brokenMutate}>❌ push() directly</button>
      </div>
      {items.map((i) => (
        <div key={i.id} className="row">
          <input type="checkbox" checked={i.done} onChange={() => toggle(i.id)} />
          <span style={{ textDecoration: i.done ? 'line-through' : 'none' }}>{i.text}</span>
          <button onClick={() => remove(i.id)}>✕</button>
        </div>
      ))}

      <h3>Nested object</h3>
      <p>{user.name} lives in {user.address.city} ({user.address.pin})</p>
      <button onClick={() => setUser({ ...user, address: { ...user.address, city: 'Hyderabad' } })}>
        Change city (spread every level you touch)
      </button>
    </div>
  );
}
