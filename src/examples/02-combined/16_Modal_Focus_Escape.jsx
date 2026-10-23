import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '16 · Modal: focus, scroll-lock, Escape, restore focus',
  summary: 'One effect that sets up several side effects and undoes ALL of them in cleanup.',
};

function Modal({ onClose, children }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }); // always the latest callback…

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    dialogRef.current.querySelector('input, button')?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus(); // give focus back to the button that opened it
    };
  }, []); // …so the effect itself never needs to re-run when onClose changes

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" ref={dialogRef} role="dialog" aria-modal="true">{children}</div>
    </div>
  );
}

export default function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <button className="primary" onClick={() => setOpen(true)}>Open modal</button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h3>Hello 👋</h3>
          <input placeholder="auto-focused" />
          <div className="row"><button onClick={() => setOpen(false)}>Close</button></div>
          <p className="muted">Esc or click the backdrop. Body scroll is locked. Focus returns to the opener.</p>
        </Modal>
      )}
    </div>
  );
}
