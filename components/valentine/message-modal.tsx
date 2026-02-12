"use client";

import { useEffect, useRef } from "react";

interface MessageModalProps {
  content: string;
  index: number;
  total: number;
  onClose: () => void;
}

/** Full-screen overlay modal showing an unlocked message */
export function MessageModal({
  content,
  index,
  total,
  onClose,
}: MessageModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  /* Close on Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-in"
      style={{
        background: "rgba(80,30,50,0.45)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl animate-card-in"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(252,212,228,0.85))",
          border: "1px solid rgba(255,255,255,0.6)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer"
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

        {/* Message number */}
        <p
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: "hsl(340,50%,60%)" }}
        >
          Message {index + 1} of {total}
        </p>

        {/* Decorative heart divider */}
        <div className="flex items-center gap-2 mb-5">
          <div
            className="flex-1 h-px"
            style={{ background: "hsl(340,40%,82%)" }}
          />
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="hsl(340,60%,65%)"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                     C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                     c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
          <div
            className="flex-1 h-px"
            style={{ background: "hsl(340,40%,82%)" }}
          />
        </div>

        {/* Message content */}
        <div
          className="text-base leading-relaxed whitespace-pre-line font-medium"
          style={{ color: "hsl(340,35%,30%)" }}
        >
          {content}
        </div>

        {/* Bottom heart */}
        <div className="flex justify-center mt-6">
          <svg
            className="w-6 h-6 animate-pulse"
            viewBox="0 0 24 24"
            fill="hsl(340,65%,60%)"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                     C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                     c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-modal-in {
          animation: modal-in 0.3s ease-out both;
        }
        @keyframes card-in {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-card-in {
          animation: card-in 0.4s ease-out 0.1s both;
        }
      `}</style>
    </div>
  );
}
