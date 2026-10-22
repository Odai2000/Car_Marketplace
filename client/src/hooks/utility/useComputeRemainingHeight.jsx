// AI generated code.


import { useState, useEffect, useCallback } from 'react';

const useComputeRemainingHeight = (ref, options = {}) => {
  const {
    offset = 0,
    minHeight = 0,
    recalculateOnResize = true,
  } = options;

  const [remainingHeight, setRemainingHeight] = useState(0);

  const calculate = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const available = viewportHeight - rect.top - offset;

    setRemainingHeight(Math.max(minHeight, available));
  }, [ref, offset, minHeight]);

  useEffect(() => {
    calculate();

    if (!recalculateOnResize) return;

    // Debounce resize for performance
    let rafId = 0;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(calculate);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculate, recalculateOnResize]);

  return { remainingHeight, recalculate: calculate };
}

export default useComputeRemainingHeight;