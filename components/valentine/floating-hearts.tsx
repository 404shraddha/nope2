"use client";

import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface FloatingHeartsProps {
  intensity?: number; // 0-1, controls how many hearts appear (default 1)
}

/** Soft floating heart particles drifting up in the background */
export function FloatingHearts({ intensity = 1 }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const count = Math.max(1, Math.floor(15 * intensity));
    const generated: Heart[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 16,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      opacity: (0.15 + Math.random() * 0.25) * intensity,
    }));
    setHearts(generated);
  }, [intensity]);

  if (hearts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {hearts.map((h) => (
        <svg
          key={h.id}
          className="absolute animate-float-up"
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            opacity: h.opacity,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
          viewBox="0 0 24 24"
          fill="hsl(340, 70%, 65%)"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                   2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                   C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                   c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--tw-opacity, 0.3);
          }
          90% {
            opacity: var(--tw-opacity, 0.3);
          }
          100% {
            transform: translateY(-10vh) rotate(25deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up linear infinite;
        }
      `}</style>
    </div>
  );
}
