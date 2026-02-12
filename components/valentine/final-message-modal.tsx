"use client";

import { useEffect, useRef, useState } from "react";
import { TypewriterReveal } from "./typewriter-reveal";
import { FloatingHearts } from "./floating-hearts";

interface FinalMessageModalProps {
  content: string;
  onClose: () => void;
}

/**
 * Cinematic final message experience with:
 * - Envelope opening animation
 * - Typewriter reveal effect
 * - Floating hearts ambience
 * - Graceful close button
 */
export function FinalMessageModal({
  content,
  onClose,
}: FinalMessageModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"envelope" | "letter" | "complete">(
    "envelope",
  );

  /* Close on Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Animate envelope opening after brief delay */
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage("letter");
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(80,30,50,0.6)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      {/* Subtle floating hearts in background */}
      {stage !== "envelope" && (
        <div className="absolute inset-0 pointer-events-none">
          <FloatingHearts intensity={0.3} />
        </div>
      )}

      {/* Envelope stage */}
      {stage === "envelope" && (
        <div className="relative animate-envelope-scale">
          {/* Envelope */}
          <div
            className="w-72 h-48 relative"
            style={{
              perspective: "1200px",
            }}
          >
            {/* Envelope body */}
            <div
              className="absolute inset-0 rounded-lg shadow-2xl animate-envelope-glow"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,250,250,0.95), rgba(252,220,235,0.9))",
                border: "2px solid rgba(255,240,248,0.8)",
              }}
            />

            {/* Envelope flap - animated to open */}
            <div
              className="absolute inset-0 rounded-t-lg animate-flap-open origin-top"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,240,248,0.95), rgba(255,230,240,0.9))",
                border: "2px solid rgba(255,240,248,0.8)",
                borderBottom: "none",
                boxShadow: "0 -4px 12px rgba(233,130,170,0.2)",
              }}
            />

            {/* Letter peeking inside */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-40 bg-white rounded-sm shadow-lg opacity-0 animate-letter-rise"
              style={{
                backgroundImage:
                  "linear-gradient(to right, transparent 24px, #f5e6ea 25px, #f5e6ea 26px, transparent 27px)",
                backgroundSize: "100% 1.5em",
                backgroundPosition: "0 0.5em",
                backgroundRepeat: "repeat-y",
              }}
            />
          </div>
        </div>
      )}

      {/* Letter stage */}
      {stage === "letter" && (
        <div
          className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl animate-letter-expand"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(252,220,235,0.9))",
            border: "2px solid rgba(255,240,248,0.8)",
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:scale-110"
            style={{
              background: "hsl(340,30%,88%)",
              color: "hsl(340,50%,40%)",
            }}
            aria-label="Close message"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Heart header */}
          <div className="flex justify-center mb-6">
            <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="hsl(340,65%,60%)">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                       C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                       c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </div>

          {/* Typewriter content */}
          <div className="mb-8">
            <TypewriterReveal
              content={content}
              speed={20}
              onComplete={() => setStage("complete")}
            />
          </div>

          {/* Bottom decoration */}
          <div className="flex justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="hsl(340,60%,65%)">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                       C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                       c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Complete stage - show close button with fade */}
      {stage === "complete" && (
        <button
          type="button"
          onClick={onClose}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 animate-fade-in"
          style={{
            background: "hsl(340,70%,60%)",
            color: "#fff",
            boxShadow: "0 4px 20px hsl(340 70% 60% / .35)",
          }}
        >
          Close 💗
        </button>
      )}

      <style jsx>{`
        @keyframes envelope-scale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-envelope-scale {
          animation: envelope-scale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)
            both;
        }

        @keyframes envelope-glow {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(233, 130, 170, 0.3);
          }
          50% {
            box-shadow: 0 0 20px 4px rgba(233, 130, 170, 0.2);
          }
        }
        .animate-envelope-glow {
          animation: envelope-glow 2s ease-in-out infinite;
        }

        @keyframes flap-open {
          0% {
            transform: rotateX(0deg);
            opacity: 1;
          }
          100% {
            transform: rotateX(-160deg);
            opacity: 0;
          }
        }
        .animate-flap-open {
          animation: flap-open 0.8s ease-in 0.4s both;
          transform-origin: top center;
        }

        @keyframes letter-rise {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-letter-rise {
          animation: letter-rise 0.6s ease-out 0.8s both;
        }

        @keyframes letter-expand {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-letter-expand {
          animation: letter-expand 0.5s ease-out both;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
}
