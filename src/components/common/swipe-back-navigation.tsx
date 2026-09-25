"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * SwipeBackNavigation
 * Enables native-feeling edge swipe-to-go-back gesture:
 * - Works on touch devices (mobile, tablet).
 * - Works with mouse drag when testing in responsive / device emulation mode.
 * - Shows an iOS / Android style pull-out glassmorphic arrow on the left edge.
 */
export function SwipeBackNavigation() {
  const router = useRouter();
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isSwiping, setIsSwiping] = React.useState(false);
  const startXRef = React.useRef<number | null>(null);
  const startYRef = React.useRef<number | null>(null);
  const isEligibleRef = React.useRef(false);
  const pullRef = React.useRef(0);

  const THRESHOLD = 70; // px required to trigger back navigation
  const MAX_PULL = 110;  // max visual travel px

  // --- TOUCH HANDLERS (Mobile / Tablet) ---
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    // Only trigger if swipe starts within 45px of the left edge
    if (touch.clientX <= 45) {
      startXRef.current = touch.clientX;
      startYRef.current = touch.clientY;
      isEligibleRef.current = true;
      pullRef.current = 0;
    } else {
      isEligibleRef.current = false;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isEligibleRef.current || startXRef.current === null || startYRef.current === null) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startXRef.current;
    const deltaY = touch.clientY - startYRef.current;

    // If user is scrolling vertically, cancel swipe gesture
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
      isEligibleRef.current = false;
      setIsSwiping(false);
      setPullDistance(0);
      return;
    }

    if (deltaX > 8) {
      setIsSwiping(true);
      // Logarithmic resistance curve for smooth feel
      const distance = Math.min(MAX_PULL, deltaX * 0.7);
      pullRef.current = distance;
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (isEligibleRef.current && pullRef.current >= THRESHOLD) {
      router.back();
    }
    isEligibleRef.current = false;
    setIsSwiping(false);
    setPullDistance(0);
    pullRef.current = 0;
    startXRef.current = null;
    startYRef.current = null;
  };

  // --- MOUSE DRAG HANDLERS (For Responsive Emulation Mode in DevTools) ---
  const handleMouseDown = (e: MouseEvent) => {
    // Left edge mouse click (within 45px)
    if (e.clientX <= 45 && e.button === 0) {
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      isEligibleRef.current = true;
      pullRef.current = 0;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isEligibleRef.current || startXRef.current === null || startYRef.current === null) return;
    // Only track if mouse button is held down
    if (e.buttons !== 1) {
      isEligibleRef.current = false;
      setIsSwiping(false);
      setPullDistance(0);
      return;
    }

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 25) {
      isEligibleRef.current = false;
      setIsSwiping(false);
      setPullDistance(0);
      return;
    }

    if (deltaX > 8) {
      setIsSwiping(true);
      const distance = Math.min(MAX_PULL, deltaX * 0.7);
      pullRef.current = distance;
      setPullDistance(distance);
    }
  };

  const handleMouseUp = () => {
    if (isEligibleRef.current && pullRef.current >= THRESHOLD) {
      router.back();
    }
    isEligibleRef.current = false;
    setIsSwiping(false);
    setPullDistance(0);
    pullRef.current = 0;
    startXRef.current = null;
    startYRef.current = null;
  };

  React.useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!isSwiping || pullDistance <= 5) return null;

  const isTriggered = pullDistance >= THRESHOLD;

  return (
    <div
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[9999] pointer-events-none transition-transform duration-75 select-none"
      style={{
        transform: `translate3d(${pullDistance - 48}px, -50%, 0)`,
      }}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl border transition-all duration-200 ${
          isTriggered
            ? "bg-[#E50000] border-[#E50000] text-white scale-110 shadow-[#E50000]/50"
            : "bg-black/85 border-white/20 text-white/80 scale-100"
        }`}
      >
        <ArrowLeft
          className={`w-5 h-5 transition-transform duration-200 ${
            isTriggered ? "-translate-x-1" : ""
          }`}
        />
      </div>

      {isTriggered && (
        <span className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/20 text-white text-[10px] font-bold whitespace-nowrap shadow-lg animate-in fade-in duration-150">
          Thả để quay lại
        </span>
      )}
    </div>
  );
}
