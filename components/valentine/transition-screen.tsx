"use client";

import { useEffect, useState } from "react";
import { FloatingHearts } from "./floating-hearts";

interface TransitionScreenProps {
  onContinue: () => void;
}

/**
 * Screen 3 -- Cinematic transition with sequenced text reveals.
 * Shows lines one at a time with gentle fade-in, then reveals
 * a glowing "Begin the quest" button.
 */
export function TransitionScreen({ onContinue }: TransitionScreenProps) {
  /* Which text lines are visible (revealed one-by-one via timers) */
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    /* Line 0: "But wait..." at 800ms */
    const t1 = setTimeout(() => setVisibleLines(1), 800);
    /* Line 1: "There's more..." at 2400ms */
    const t2 = setTimeout(() => setVisibleLines(2), 2400);
    /* Button appears at 4000ms */
    const t3 = setTimeout(() => setShowButton(true), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, hsl(340,40%,90%), hsl(350,35%,85%) 60%, hsl(340,30%,80%))",
      }}
    >
      <FloatingHearts />

      {/* Sparkle particles */}
      <Sparkles />

      <div className="z-10 flex flex-col items-center gap-6 px-6 text-center">
        {/* Line 1 */}
        <p
          className="transition-all duration-1000 ease-out text-lg font-semibold md:text-xl"
          style={{
            color: "hsl(340,50%,55%)",
            opacity: visibleLines >= 1 ? 1 : 0,
            transform: visibleLines >= 1 ? "translateY(0)" : "translateY(12px)",
          }}
        >
          {"But wait\u2026"}
        </p>

        {/* Line 2 */}
        <h1
          className="transition-all duration-1000 ease-out text-3xl font-extrabold tracking-tight md:text-5xl"
          style={{
            color: "hsl(340,70%,45%)",
            opacity: visibleLines >= 2 ? 1 : 0,
            transform: visibleLines >= 2 ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
          }}
        >
          {"There\u2019s more\u2026"}
        </h1>

        {/* Glowing CTA button */}
        <div
          className="transition-all duration-1000 ease-out mt-4"
          style={{
            opacity: showButton ? 1 : 0,
            transform: showButton ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
          }}
        >
          <button
            type="button"
            onClick={onContinue}
            disabled={!showButton}
            className="relative rounded-full font-bold shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
            style={{
              background: "linear-gradient(135deg, hsl(340,70%,60%), hsl(350,65%,55%))",
              color: "#fff",
              padding: "16px 44px",
              fontSize: "1.125rem",
              boxShadow:
                "0 0 24px hsl(340 70% 60% / .4), 0 4px 20px hsl(340 70% 60% / .25)",
            }}
          >
            {/* Glow ring behind button */}
            <span
              className="absolute inset-0 rounded-full animate-glow-pulse"
              style={{
                border: "2px solid hsl(340,60%,70%)",
              }}
              aria-hidden="true"
            />
            {"Begin the quest"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes glow-pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.06);
          }
        }
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}

/* ── Sparkle particles ── */
function Sparkles() {
  const [sparkles, setSparkles] = useState<
    { id: number; left: number; top: number; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        size: 3 + Math.random() * 5,
      })),
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-sparkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: "hsl(340,80%,80%)",
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
