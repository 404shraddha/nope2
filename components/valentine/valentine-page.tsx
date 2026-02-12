"use client";

import { useCallback, useRef, useState } from "react";
import { CuteCat } from "./cute-cat";
import { Confetti } from "./confetti";
import { FloatingHearts } from "./floating-hearts";
import { TransitionScreen } from "./transition-screen";
import { MessagesScreen } from "./messages-screen";

type Screen = "asking" | "accepted" | "transition" | "messages";

export function ValentinePage() {
  const [screen, setScreen] = useState<Screen>("asking");
  const [yesScale, setYesScale] = useState(1);
  const [noPosition, setNoPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Move the "No" button to a random spot when cursor gets near */
  const dodgeNoButton = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const padding = 60;
    const maxX = rect.width - padding;
    const maxY = rect.height - padding;
    const newX = padding + Math.random() * (maxX - padding);
    const newY = padding + Math.random() * (maxY - padding);
    setNoPosition({ x: newX, y: newY });
    setYesScale((prev) => Math.min(prev + 0.08, 1.6));
  }, []);

  /** Handle "Yes" click */
  const handleYes = useCallback(() => {
    setScreen("accepted");
  }, []);

  /* ── Transition screen ── */
  if (screen === "transition") {
    return <TransitionScreen onContinue={() => setScreen("messages")} />;
  }

  /* ── Messages / quest screen ── */
  if (screen === "messages") {
    return <MessagesScreen />;
  }

  /* ── Accepted (happy) screen ── */
  if (screen === "accepted") {
    return (
      <main
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, hsl(350,50%,96%), hsl(340,40%,92%))",
        }}
      >
        <FloatingHearts />
        <Confetti />

        <div className="z-10 flex flex-col items-center gap-6 px-4 text-center">
          <CuteCat happy />
          <h1
            className="text-3xl font-extrabold tracking-tight md:text-5xl"
            style={{ color: "hsl(340,70%,45%)" }}
          >
            {"Yayyy!! Good choice"}
          </h1>
          <p
            className="text-lg md:text-xl font-semibold"
            style={{ color: "hsl(340,50%,55%)" }}
          >
            {"You just made this kitty the happiest in the world!"}
          </p>

          {/* Continue button */}
          <button
            type="button"
            onClick={() => setScreen("transition")}
            className="mt-4 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer select-none animate-pulse"
            style={{
              background: "hsl(340,70%,60%)",
              color: "#fff",
              padding: "14px 36px",
              fontSize: "1.125rem",
              boxShadow: "0 4px 20px hsl(340 70% 60% / .35)",
            }}
          >
            {"Continue"}
          </button>
        </div>
      </main>
    );
  }

  /* ── Asking screen (default) ── */
  return (
    <main
      ref={containerRef}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, hsl(350,50%,96%), hsl(340,40%,92%))",
      }}
    >
      <FloatingHearts />

      <div className="z-10 flex flex-col items-center gap-8 px-4 text-center">
        <CuteCat />

        <h1
          className="text-3xl font-extrabold tracking-tight md:text-5xl text-balance"
          style={{ color: "hsl(340,70%,45%)" }}
        >
          Will you be my Valentine?
        </h1>

        {/* Buttons row */}
        <div className="flex items-center gap-6">
          {/* Yes button -- grows as user tries to click No */}
          <button
            type="button"
            onClick={handleYes}
            className="rounded-full font-bold shadow-lg transition-all duration-300 cursor-pointer select-none"
            style={{
              transform: `scale(${yesScale})`,
              background: "hsl(340,70%,60%)",
              color: "#fff",
              padding: "14px 36px",
              fontSize: "1.125rem",
              boxShadow: "0 4px 20px hsl(340 70% 60% / .35)",
            }}
          >
            {"Yes"}
          </button>

          {/* No button -- dodges on hover/touch */}
          <button
            ref={noRef}
            type="button"
            onMouseEnter={dodgeNoButton}
            onTouchStart={dodgeNoButton}
            className="rounded-full font-bold shadow-md transition-all duration-300 cursor-pointer select-none"
            style={{
              background: "hsl(270,20%,85%)",
              color: "hsl(340,30%,35%)",
              padding: "14px 36px",
              fontSize: "1.125rem",
              ...(noPosition
                ? {
                    position: "fixed",
                    left: noPosition.x,
                    top: noPosition.y,
                    zIndex: 30,
                  }
                : {}),
            }}
          >
            {"No"}
          </button>
        </div>

        <p
          className="text-sm font-medium"
          style={{ color: "hsl(340,40%,65%)" }}
        >
          {"(Hint: there's really only one option)"}
        </p>
      </div>
    </main>
  );
}
