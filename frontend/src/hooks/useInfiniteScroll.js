import { useEffect, useRef, useCallback } from "react";

// New Concept: Custom hooks
// A custom hook is just a function that starts with "use" and uses other hooks
// It lets you EXTRACT stateful logic out of components and REUSE it
// Rule: can only be called inside a React component or another custom hook

function useInfiniteScroll(onIntersect, options = {}) {
  // useRef stores a value that persists across renders
  // but changing it does NOT cause a re-render (unlike useState)
  // Perfect for: DOM refs, timer IDs, observer instances
  const observerRef = useRef(null);

  // useCallback memoizes the function — only recreates if deps change
  // Prevents the useEffect below from running on every render
  const callbackRef = useCallback(
    (node) => {
      // node = the DOM element React attaches this ref to
      // node is null when component unmounts — clean up observer
      if (!node) {
        observerRef.current?.disconnect();
        return;
      }

      // Disconnect previous observer before creating new one
      observerRef.current?.disconnect();

      // Create the observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // entries[0] is our sentinel element
          if (entries[0].isIntersecting) {
            // Element entered viewport → load more
            onIntersect();
          }
        },
        {
          threshold: 0.1, // fire when 10% of element is visible
          ...options,
        },
      );

      // Start watching this DOM node
      observerRef.current.observe(node);
    },
    [onIntersect],
  );

  return callbackRef; // attach this as a ref to your sentinel div
}

export default useInfiniteScroll;
