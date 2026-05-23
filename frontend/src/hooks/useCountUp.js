import { useState, useEffect, useRef } from "react";

// New Concept: requestAnimationFrame
// setTimeout/setInterval are not frame-accurate — they can skip or bunch up.
// requestAnimationFrame (rAF) fires exactly once per screen refresh (60fps).
// It's the correct tool for smooth number animations.
//
// Animation math:
// elapsed / duration = progress (0 → 1)
// easeOut(progress)  = slows down near the end (feels natural)
// current value      = start + (end - start) * easedProgress

function useCountUp(target, duration = 1500) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef(null); // store rAF id for cleanup
  const startRef = useRef(null); // store animation start timestamp

  useEffect(() => {
    if (!target) return;

    // Ease-out cubic: fast start, slow finish
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp) => {
      // On first frame, record the start time
      if (!startRef.current) startRef.current = timestamp;

      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1); // cap at 1
      const easedVal = Math.floor(easeOut(progress) * target);

      setCurrent(easedVal);

      if (progress < 1) {
        // Not done yet — schedule next frame
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete — set exact final value
        setCurrent(target);
      }
    };

    // Kick off the animation
    rafRef.current = requestAnimationFrame(animate);

    // Cleanup: cancel animation if component unmounts mid-animation
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [target, duration]);

  return current;
}

export default useCountUp;
