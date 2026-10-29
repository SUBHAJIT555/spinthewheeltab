"use client";

import { useCallback, useEffect, useState } from "react";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    nav.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

function canRequestFullscreen(): boolean {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
  };
  return Boolean(el.requestFullscreen || el.webkitRequestFullscreen);
}

export default function FullscreenLaunch() {
  const [standalone, setStandalone] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const sync = () => {
      setStandalone(isStandalone());
      setFullscreen(Boolean(document.fullscreenElement));
    };
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const handleClick = useCallback(async () => {
    if (canRequestFullscreen()) {
      const el = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void> | void;
      };
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
          return;
        }
        el.webkitRequestFullscreen?.();
        return;
      } catch {
        /* iPad Safari often blocks this — show the Home Screen steps instead */
      }
    }
    setShowTip((open) => !open);
  }, []);

  if (standalone || fullscreen) return null;

  return (
    <div className="wheel-fullscreen">
      <button
        type="button"
        className="wheel-fullscreen-btn"
        onClick={() => void handleClick()}
      >
        Full screen
      </button>
      {showTip && (
        <div className="wheel-fullscreen-tip">
          <p>On iPad, Add to Home Screen is in the Share popover list, not the app icons.</p>
          <ol>
            <li>Open this site in Safari</li>
            <li>Tap the Share button (square with the arrow)</li>
            <li>Scroll the list under the icons</li>
            <li>Tap Add to Home Screen</li>
            <li>If it is missing, tap Edit Actions and turn it on</li>
          </ol>
          <button
            type="button"
            className="wheel-fullscreen-close"
            onClick={() => setShowTip(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
