import { useEffect, useState } from 'react';

export const meta = {
  title: '26 · StrictMode: why effects run twice in dev',
  summary: 'React mounts → unmounts → remounts to prove your cleanup is correct. A leak shows up immediately.',
};

const connections = { bad: 0, good: 0 }; // pretend: open sockets, subscriptions…

function Bad() {
  useEffect(() => {
    connections.bad += 1; // ❌ connects, never disconnects
  }, []);
  return <p>❌ Bad mounted</p>;
}

function Good() {
  useEffect(() => {
    connections.good += 1;
    return () => { connections.good -= 1; }; // ✅ symmetrical cleanup
  }, []);
  return <p>✅ Good mounted</p>;
}

export default function StrictModeDemo() {
  const [show, setShow] = useState(false);
  const [, refresh] = useState(0);

  return (
    <div className="card">
      <div className="row">
        <button onClick={() => setShow((s) => !s)}>{show ? 'Unmount' : 'Mount'} both</button>
        <button onClick={() => refresh((x) => x + 1)}>Refresh numbers</button>
        <button onClick={() => { connections.bad = 0; connections.good = 0; refresh((x) => x + 1); }}>Reset</button>
      </div>
      {show && <><Bad /><Good /></>}
      <table>
        <tbody>
          <tr><td>open connections (Bad)</td><td className="bad">{connections.bad}</td></tr>
          <tr><td>open connections (Good)</td><td className="good">{connections.good}</td></tr>
        </tbody>
      </table>
      <p className="muted">
        Mount once: Bad = 2 (leaked!), Good = 1 (correct). Unmount: Good → 0, Bad stays. In production builds
        effects run once, but the leak is still real — StrictMode just makes it visible early.
        Never "fix" the double run with a ref flag; fix the cleanup.
      </p>
    </div>
  );
}
