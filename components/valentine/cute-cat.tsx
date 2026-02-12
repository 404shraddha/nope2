"use client";

/** Cute cartoon cat SVG -- two variants: asking & happy */
export function CuteCat({ happy = false }: { happy?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 220"
      className="w-48 h-48 md:w-64 md:h-64 select-none"
      aria-label={happy ? "Happy dancing cat" : "Cute cat asking a question"}
    >
      {/* Ears */}
      <polygon points="55,55 75,10 95,55" fill="#f9a8c9" stroke="#e8849f" strokeWidth="2" />
      <polygon points="105,55 125,10 145,55" fill="#f9a8c9" stroke="#e8849f" strokeWidth="2" />
      {/* Inner ears */}
      <polygon points="65,50 75,22 85,50" fill="#fcd4e4" />
      <polygon points="115,50 125,22 135,50" fill="#fcd4e4" />

      {/* Head */}
      <ellipse cx="100" cy="90" rx="55" ry="50" fill="#f9a8c9" stroke="#e8849f" strokeWidth="2" />

      {/* Eyes */}
      {happy ? (
        <>
          <path d="M75,82 Q80,74 85,82" fill="none" stroke="#4a3040" strokeWidth="3" strokeLinecap="round" />
          <path d="M115,82 Q120,74 125,82" fill="none" stroke="#4a3040" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="80" cy="85" rx="10" ry="12" fill="#4a3040" />
          <ellipse cx="120" cy="85" rx="10" ry="12" fill="#4a3040" />
          <circle cx="84" cy="80" r="3" fill="#fff" />
          <circle cx="124" cy="80" r="3" fill="#fff" />
          <circle cx="77" cy="88" r="1.5" fill="#fff" />
          <circle cx="117" cy="88" r="1.5" fill="#fff" />
        </>
      )}

      {/* Blush */}
      <ellipse cx="65" cy="100" rx="8" ry="5" fill="#fca5c4" opacity="0.5" />
      <ellipse cx="135" cy="100" rx="8" ry="5" fill="#fca5c4" opacity="0.5" />

      {/* Nose */}
      <ellipse cx="100" cy="97" rx="4" ry="3" fill="#e8849f" />

      {/* Mouth */}
      {happy ? (
        <path d="M90,105 Q100,118 110,105" fill="none" stroke="#4a3040" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <>
          <path d="M94,104 Q100,110 100,104" fill="none" stroke="#4a3040" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M100,104 Q100,110 106,104" fill="none" stroke="#4a3040" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}

      {/* Whiskers */}
      <line x1="50" y1="92" x2="72" y2="95" stroke="#4a3040" strokeWidth="1" />
      <line x1="50" y1="100" x2="72" y2="100" stroke="#4a3040" strokeWidth="1" />
      <line x1="128" y1="95" x2="150" y2="92" stroke="#4a3040" strokeWidth="1" />
      <line x1="128" y1="100" x2="150" y2="100" stroke="#4a3040" strokeWidth="1" />

      {/* Body */}
      <ellipse cx="100" cy="165" rx="40" ry="35" fill="#f9a8c9" stroke="#e8849f" strokeWidth="2">
        {happy && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-5 100 165;5 100 165;-5 100 165"
            dur="0.5s"
            repeatCount="indefinite"
          />
        )}
      </ellipse>

      {/* Paws */}
      <ellipse cx="75" cy="195" rx="12" ry="8" fill="#f9a8c9" stroke="#e8849f" strokeWidth="2" />
      <ellipse cx="125" cy="195" rx="12" ry="8" fill="#f9a8c9" stroke="#e8849f" strokeWidth="2" />

      {/* Tail */}
      <path
        d="M140,165 Q170,140 155,115"
        fill="none"
        stroke="#f9a8c9"
        strokeWidth="8"
        strokeLinecap="round"
      >
        {happy && (
          <animate
            attributeName="d"
            values="M140,165 Q170,140 155,115;M140,165 Q175,150 165,120;M140,165 Q170,140 155,115"
            dur="0.6s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Heart held by cat (only in happy state) */}
      {happy && (
        <g>
          <path
            d="M90,150 C90,143 80,140 80,147 C80,153 90,160 90,160 C90,160 100,153 100,147 C100,140 90,143 90,150Z"
            fill="#e8466a"
          >
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.15;1"
              dur="0.8s"
              repeatCount="indefinite"
              additive="sum"
              calcMode="spline"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </path>
        </g>
      )}

      {/* Bounce animation for the whole cat when happy */}
      {happy && (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;0,-8;0,0"
          dur="0.6s"
          repeatCount="indefinite"
        />
      )}
    </svg>
  );
}
