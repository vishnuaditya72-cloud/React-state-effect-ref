import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '13 · Form: autofocus, validation, focus first error',
  summary: 'Effect focuses on mount, refs focus the first invalid field, errors are DERIVED during render.',
};

export default function FormValidation() {
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => { emailRef.current.focus(); }, []); // autofocus on mount

  // derived data — computed every render, NOT stored in state, so it can never be out of sync
  const errors = {};
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email';
  if (values.password.length < 8) errors.password = 'At least 8 characters';

  const show = (f) => (touched[f] || submitted) && errors[f];
  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const blur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (errors.email) return emailRef.current.focus();
    if (errors.password) return passRef.current.focus();
    setOk(true);
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <div className="row"><input ref={emailRef} name="email" type="email" value={values.email} onChange={change} onBlur={blur} placeholder="email" /></div>
      {show('email') && <div className="err">{errors.email}</div>}
      <div className="row"><input ref={passRef} name="password" type="password" value={values.password} onChange={change} onBlur={blur} placeholder="password" /></div>
      {show('password') && <div className="err">{errors.password}</div>}
      <button className="primary">Submit</button>
      {ok && <span className="good"> ✓ valid!</span>}
    </form>
  );
}
