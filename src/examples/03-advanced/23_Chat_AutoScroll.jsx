import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '23 · Chat: smart auto-scroll, refocus, timers',
  summary: 'Only stick to the bottom if the user is already there. Refs track scroll intent and pending timers.',
};

const REPLIES = ['Interesting!', 'Tell me more.', 'Hooks are fun 😄', 'Ref > state here', 'Got it.'];

export default function Chat() {
  const [messages, setMessages] = useState([{ id: 1, from: 'bot', text: 'Hi! Say something.' }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const stick = useRef(true);   // is the user at the bottom?
  const nextId = useRef(2);
  const timers = useRef([]);

  const add = (from, text) => { const id = nextId.current++; setMessages((m) => [...m, { id, from, text }]); };

  function onScroll() {
    const el = listRef.current;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  }

  useEffect(() => {
    if (stick.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []); // no setState after unmount

  function send(e) {
    e.preventDefault();
    if (!input.trim()) return;
    stick.current = true; // sending always jumps to bottom
    add('me', input);
    setInput('');
    inputRef.current.focus();
    setTyping(true);
    timers.current.push(setTimeout(() => { add('bot', REPLIES[Math.floor(Math.random() * REPLIES.length)]); setTyping(false); }, 900));
  }

  return (
    <div className="card">
      <div className="scroller" ref={listRef} onScroll={onScroll} style={{ height: 260 }}>
        {messages.map((m) => <div key={m.id} className={'bubble ' + m.from}>{m.text}</div>)}
        {typing && <div className="muted">bot is typing…</div>}
      </div>
      <form className="row" onSubmit={send}>
        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="message" style={{ flex: 1 }} />
        <button className="primary">Send</button>
        <button type="button" onClick={() => Array.from({ length: 8 }, (_, i) => add('bot', 'spam ' + (i + 1)))}>+8 bot msgs</button>
      </form>
      <p className="muted">Scroll up, then click "+8 bot msgs": the view stays put. At the bottom, it follows.</p>
    </div>
  );
}
