import { useEffect, useRef, useState } from 'react';

export const meta = {
  title: '11 · Debounced search',
  summary: 'Wait until the user stops typing. The cleanup cancels the previous timer on every keystroke.',
};

const WORDS = 'react hooks useState useEffect useRef useMemo useCallback useContext useReducer useId useTransition useLayoutEffect redux router vite next node express mongo mysql'.split(' ');

export default function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [searches, setSearches] = useState(0);
  const keystrokes = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 400);
    return () => clearTimeout(t); // new keystroke → old timer is cancelled
  }, [query]);

  useEffect(() => {
    if (debounced) setSearches((n) => n + 1); // pretend this is an API call
  }, [debounced]);

  const results = debounced ? WORDS.filter((w) => w.toLowerCase().includes(debounced.toLowerCase())) : [];

  return (
    <div className="card">
      <input
        value={query}
        onChange={(e) => { keystrokes.current += 1; setQuery(e.target.value); }}
        placeholder="try typing 'use'"
      />
      <p>
        Keystrokes: <b>{keystrokes.current}</b> · "API calls": <b>{searches}</b> · debounced value: <code>{debounced}</code>
      </p>
      <ul>{results.map((w) => <li key={w}>{w}</li>)}</ul>
    </div>
  );
}
