"use client";

import { useState, useEffect, useRef } from "react";

export function useTimer(guideSecs: number) {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [guideSecs]); // Reset when question changes

  const isOverTime = elapsed > guideSecs;
  const progress = Math.min(100, (elapsed / guideSecs) * 100);

  return {
    elapsed,
    guideSecs,
    isOverTime,
    progress,
    startTime: startTimeRef.current,
  };
}
