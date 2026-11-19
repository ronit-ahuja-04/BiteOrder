import { useEffect, useState } from 'react';

// Custom hook: returns `value` only after it has stopped changing for `delay` ms
// (stops the menu being re-filtered on every keystroke). Used by: MenuPage search.
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t); // cleanup on every change
  }, [value, delay]);
  return debounced;
}
