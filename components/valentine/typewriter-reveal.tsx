"use client";

import { useEffect, useState } from "react";

interface TypewriterRevealProps {
  content: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void;
}

/**
 * Typewriter effect that reveals text character by character.
 * User can click to speed up or skip to end.
 */
export function TypewriterReveal({
  content,
  speed = 25,
  onComplete,
}: TypewriterRevealProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < content.length) {
        charIndex += 1;
        setDisplayedText(content.substring(0, charIndex));
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, isComplete, onComplete]);

  /** Skip to end on click */
  const handleSkip = () => {
    setDisplayedText(content);
    setIsComplete(true);
    onComplete?.();
  };

  return (
    <div
      className="cursor-pointer"
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleSkip();
        }
      }}
    >
      <div
        className="text-base leading-relaxed whitespace-pre-line font-medium"
        style={{ color: "hsl(340,35%,30%)" }}
      >
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-1 h-5 ml-0.5 bg-current opacity-70 animate-pulse" />
        )}
      </div>
    </div>
  );
}
