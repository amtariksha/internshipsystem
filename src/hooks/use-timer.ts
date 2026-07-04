"use client";

import { useState, useEffect, useRef } from "react";

interface TimerState {
  elapsed: number;
  startTime: number;
}

export function useTimer(guideSecs: number) {
  // Lazy initializer: Date.now() runs once at mount, never during render.
  const [{ elapsed, startTime }, setState] = useState<TimerState>(() => ({
    elapsed: 0,
    startTime: Date.now(),
  }));
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const start = Date.now();
    startTimeRef.current = start;

    const tick = () => {
      setState({
        elapsed: Math.floor((Date.now() - startTimeRef.current) / 1000),
        startTime: startTimeRef.current,
      });
    };

    // Reset immediately via an async task (not a synchronous setState in the
    // effect body, which react-hooks/set-state-in-effect forbids), then tick.
    const resetTimeout = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);

    return () => {
      clearTimeout(resetTimeout);
      clearInterval(interval);
    };
  }, [guideSecs]); // Reset when question changes

  const isOverTime = elapsed > guideSecs;
  const progress = Math.min(100, (elapsed / guideSecs) * 100);

  return {
    elapsed,
    guideSecs,
    isOverTime,
    progress,
    startTime,
  };
}
