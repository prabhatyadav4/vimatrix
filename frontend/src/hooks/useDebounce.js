import { useState, useEffect } from "react";

// New Concept: Debouncing
// Without debounce: user types "react" → 5 API calls (r, re, rea, reac, react)
// With debounce:    user types "react" → 1 API call (fires 400ms after they stop)
//
// How it works:
// Every time value changes, we set a timer.
// If value changes again BEFORE the timer fires → cancel it, start fresh.
// Only when value is stable for `delay` ms → update debouncedValue.

function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If value changes before timer fires — cancel and restart
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
