"use client";

interface HeartProgressProps {
  unlocked: number;
  total: number;
  allDone: boolean;
}

/** Heart-shaped progress meter that fills as messages are unlocked */
export function HeartProgress({
  unlocked,
  total,
  allDone,
}: HeartProgressProps) {
  const fraction = total > 0 ? unlocked / total : 0;
  
  // Trigger completion animation when all unlocked
  const justCompleted = allDone && unlocked === total;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Heart SVG with clip-masked fill */}
      <div
        className={`relative w-16 h-16 ${allDone ? "animate-celebrate" : unlocked > 0 ? "animate-gentle-pulse" : ""}`}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <defs>
            <linearGradient id="heart-fill-grad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="hsl(340,75%,55%)" />
              <stop offset="100%" stopColor="hsl(350,70%,70%)" />
            </linearGradient>
            <clipPath id="heart-clip">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                       C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                       c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </clipPath>
          </defs>

          {/* Empty heart outline */}
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
               2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
               C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
               c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="hsl(340,30%,88%)"
            stroke="hsl(340,40%,75%)"
            strokeWidth="0.5"
          />

          {/* Filled portion -- rises from bottom based on fraction */}
          <rect
            x="0"
            y={24 - fraction * 24}
            width="24"
            height={fraction * 24}
            fill="url(#heart-fill-grad)"
            clipPath="url(#heart-clip)"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Glow when all done */}
        {allDone && (
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: "hsl(340,70%,60%)" }}
          />
        )}
      </div>

      {/* Text label */}
      <p
        className={`text-sm font-bold tracking-wide ${justCompleted ? "animate-completion-text" : ""}`}
        style={{ color: "hsl(340,50%,45%)" }}
      >
        {allDone ? "All unlocked 💘" : `${unlocked} / ${total} unlocked`}
      </p>

      <style jsx>{`
        @keyframes gentle-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
        }
        .animate-gentle-pulse {
          animation: gentle-pulse 2s ease-in-out infinite;
        }
        @keyframes celebrate {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.12) rotate(-4deg);
          }
          50% {
            transform: scale(1.08) rotate(4deg);
          }
          75% {
            transform: scale(1.12) rotate(-2deg);
          }
        }
        .animate-celebrate {
          animation: celebrate 1.2s ease-in-out infinite;
        }
        @keyframes completion-text {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-completion-text {
          animation: completion-text 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
