# ⚛️ React Hooks Lab — useState · useEffect · useRef (beginner → expert)

```bash
npm install
npm run dev      # open the URL Vite prints
```

The sidebar lists every example. Each page has a **Show source code** button, and the same file lives in
`src/examples/<level>/`. Open the browser DevTools **console** — many examples log renders, setups and cleanups.

## Learning path

| Level | Files | You learn |
|---|---|---|
| 1 · Basics | 01–08 | useState (counter, forms, arrays/objects, updater, lazy init), useEffect (deps, cleanup), useRef (DOM, mutable value) |
| 2 · Combined | 09–16 | stopwatch, fetching, debounce, localStorage, form focus/validation, dropdown, scroll/resize, modal |
| 3 · Advanced | 17–24 | stale closures, usePrevious/useInterval, infinite scroll, race conditions, canvas loop, undo/redo, chat auto-scroll, drag |
| 4 · Expert | 25–32 | custom-hook library, StrictMode, external subscriptions, advanced refs, effect anti-patterns, 2 mini apps, cheat sheet |

## How to study

1. Read the code, predict what will happen, then click and check the console.
2. Break it on purpose (remove a cleanup, empty the deps array) and observe the bug.
3. Re-type the example from memory in a new file inside `src/examples/…` — it appears in the sidebar automatically.
4. Finish with `32_Cheat_Sheet`.

Shared custom hooks live in `src/hooks/index.js`. StrictMode is enabled in `src/main.jsx` on purpose.
Examples 10 and 25 call jsonplaceholder.typicode.com, so they need internet.
