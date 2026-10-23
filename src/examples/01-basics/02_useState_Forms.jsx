import { useState } from 'react';

export const meta = {
  title: '02 · useState: controlled inputs',
  summary: 'Input, checkbox, radio, select, textarea — React state is the single source of truth.',
};

export default function Forms() {
  // 1) one state per field
  const [name, setName] = useState('');

  // 2) one object for many fields + ONE generic handler
  const [form, setForm] = useState({ email: '', role: 'dev', plan: 'free', subscribe: false, bio: '' });

  function handleChange(e) {
    const { name: field, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [field]: type === 'checkbox' ? checked : value }));
  }

  return (
    <div className="card">
      <h3>Single field</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <p>Hello, {name || 'stranger'}! ({name.length} chars)</p>

      <h3>Object state + generic handler</h3>
      <div className="row">
        <input name="email" value={form.email} onChange={handleChange} placeholder="email" />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="dev">Developer</option>
          <option value="design">Designer</option>
          <option value="pm">PM</option>
        </select>
      </div>
      <div className="row">
        {['free', 'pro', 'team'].map((p) => (
          <label key={p}>
            <input type="radio" name="plan" value={p} checked={form.plan === p} onChange={handleChange} /> {p}
          </label>
        ))}
        <label>
          <input type="checkbox" name="subscribe" checked={form.subscribe} onChange={handleChange} /> newsletter
        </label>
      </div>
      <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" />
      <pre className="box">{JSON.stringify(form, null, 2)}</pre>
    </div>
  );
}
