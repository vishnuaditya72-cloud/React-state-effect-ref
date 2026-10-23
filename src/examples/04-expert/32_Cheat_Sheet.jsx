export const meta = {
  title: '32 · Cheat sheet: when to use which hook + common bugs',
  summary: 'A one-page decision guide. Re-read this after finishing the examples.',
};

const WHICH = [
  ['Value shown on screen that changes over time', 'useState'],
  ['Value that depends on old value (counter, toggle, list)', 'useState + updater: setX(prev => …)'],
  ['Value computable from props/state', 'NOT state — compute during render'],
  ['Sync with network / timer / subscription / document.title', 'useEffect (+ cleanup)'],
  ['React to a user click or submit', 'event handler, NOT useEffect'],
  ['Reach a DOM node (focus, scroll, measure, canvas, video)', 'useRef(null) + ref={…}'],
  ['Remember something across renders without re-rendering (timer id, previous value, latest callback, drag offset)', 'useRef(initial)'],
  ['Per-frame animation data', 'useRef (state only for what the UI must show)'],
];

const BUGS = [
  ['Infinite loop', 'effect sets state that is in its own deps, or no dep array + setState inside. Add the right deps / use an updater / derive instead.'],
  ['Stale closure', 'effect or timeout reads an old state snapshot. Use updater, add deps, or read from a ref (useLatest).'],
  ['Object/array in deps re-runs every render', 'new reference each render. Depend on primitives (id) or move the object outside / inside the effect.'],
  ['Mutating state', 'push/splice/obj.x = … → no re-render. Always copy: spread, map, filter.'],
  ['Missing cleanup', 'listeners, intervals, observers, sockets, animation frames must be removed in the returned function.'],
  ['Race condition', 'async result of an old dependency wins. Use an `ignore` flag or AbortController in cleanup.'],
  ['Reading ref.current in render for UI', 'ref changes do not re-render. If the UI must show it, it is state.'],
  ['Writing ref.current during render', 'do it in effects or handlers (render must be pure).'],
  ['ref is null', 'ref.current is set AFTER mount; use it in effects/handlers, not during the first render.'],
  ['Effect runs twice in dev', 'StrictMode. Fix the cleanup, don\'t hide it.'],
  ['async function directly in useEffect', 'effect callback must return undefined or a cleanup. Define async fn inside and call it.'],
];

export default function CheatSheet() {
  return (
    <div className="card">
      <h3>Which tool?</h3>
      <table><tbody>{WHICH.map(([a, b]) => <tr key={a}><td>{a}</td><td><b>{b}</b></td></tr>)}</tbody></table>

      <h3>Golden rules</h3>
      <ol>
        <li>Call hooks at the top level, in the same order every render (no ifs, loops, early returns before them).</li>
        <li>State is a snapshot: setting it does not change the variable in the current render.</li>
        <li>Effects describe "synchronise X with Y". The dependency array lists everything the effect reads.</li>
        <li>Every subscribe/start in an effect needs the matching unsubscribe/stop in cleanup.</li>
        <li>A ref is an escape hatch: for the DOM and for values the UI doesn't display.</li>
      </ol>

      <h3>Common bugs → cause → fix</h3>
      <table><tbody>{BUGS.map(([a, b]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td></tr>)}</tbody></table>

      <h3>Dependency array cheat</h3>
      <table><tbody>
        <tr><td><code>useEffect(fn)</code></td><td>after every render</td></tr>
        <tr><td><code>useEffect(fn, [])</code></td><td>after mount only (cleanup on unmount)</td></tr>
        <tr><td><code>useEffect(fn, [a, b])</code></td><td>after mount and whenever a or b changed (cleanup runs before each re-run)</td></tr>
      </tbody></table>
    </div>
  );
}
