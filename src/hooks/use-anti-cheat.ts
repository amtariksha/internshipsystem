"use client";

import { useEffect, useRef, useCallback } from "react";

interface AntiCheatState {
  tabSwitchCount: number;
  copyPasteCount: number;
}

export function useAntiCheat() {
  const stateRef = useRef<AntiCheatState>({
    tabSwitchCount: 0,
    copyPasteCount: 0,
  });

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        stateRef.current.tabSwitchCount++;
      }
    }

    function handleCopy(e: ClipboardEvent) {
      e.preventDefault();
    }

    function handlePaste(e: ClipboardEvent) {
      e.preventDefault();
      stateRef.current.copyPasteCount++;
    }

    function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
    }

    // Block back/forward navigation
    function handlePopState() {
      window.history.pushState(null, "", window.location.href);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("popstate", handlePopState);

    // Push initial state to trap back button
    window.history.pushState(null, "", window.location.href);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const getDeltas = useCallback(() => {
    const deltas = { ...stateRef.current };
    stateRef.current = { tabSwitchCount: 0, copyPasteCount: 0 };
    return deltas;
  }, []);

  return { getDeltas };
}
