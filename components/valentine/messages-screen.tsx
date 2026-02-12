"use client";

import { useCallback, useState } from "react";
import { FloatingHearts } from "./floating-hearts";
import { HeartProgress } from "./heart-progress";
import { MessageModal } from "./message-modal";
import { FinalMessageModal } from "./final-message-modal";
import { Confetti } from "./confetti";

/* ================================================================
   Message data -- easy to modify dates and content later.
   Each message includes an id, content, unlockDate, and label.
   ================================================================ */
export interface ValentineMessage {
  id: number;
  content: string;
  unlockDate: string; // ISO date string, e.g. "2025-02-10"
  unlockLabel: string; // display label for locked state
}

/* Emoji sequence for locked messages -- scales with any number of future items */
const LOCK_EMOJIS = ["\uD83D\uDC8C", "\uD83D\uDC9D", "\uD83D\uDC97", "\uD83D\uDC96", "\uD83D\uDC98"];

/** Format an ISO date string into a human-friendly unlock label, e.g. "Unlocks on 11 Feb" */
function formatUnlockLabel(isoDate: string, emojiIndex: number): string {
  const d = new Date(isoDate + "T00:00:00");
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const emoji = LOCK_EMOJIS[emojiIndex % LOCK_EMOJIS.length];
  return `Unlocks on ${day} ${month} ${emoji}`;
}

const MESSAGES: ValentineMessage[] = [
  {
    id: 1,
    content: `Hi baby, told you I was cheesy. By saying yes, you've unlocked the first message, which means you are closer to the second one!

Thank you, for being my valentine this 14th feb and for being my valentine the past 6 months.

I know things haven't been smooth and the road was rocky, maybe even too rocky, but thank you for choosing to stick with me.

I love you. There is no one else I want to spend my life with.`,
    unlockDate: "2026-02-10",
    unlockLabel: "First message",
  },
  {
    id: 2,
    content: `If you're reading this, it means you waited patiently… or you time-traveled. Either way, I'm proud of you. Today's message is simple: thank you for choosing us, even when things weren't easy. That choice means more to me than you'll ever know.`,
    unlockDate: "2026-02-11",
    unlockLabel: "",
  },
  {
    id: 3,
    content: `You deserve to be loved loudly, gently, and consistently. I hope I can keep learning how to love you better every single day.`,
    unlockDate: "2026-02-12",
    unlockLabel: "",
  },
  {
    id: 4,
    content: `Almost there… Just one more day before Valentine's. I hope you feel how intentional this all is. You matter to me. A lot.`,
    unlockDate: "2026-02-13",
    unlockLabel: "",
  },
  {
    id: 5,
    content: `Happy Valentine's Day 💘

If you're reading this, it means we made it to today.
And maybe that sounds simple, but to me, it's everything.

These past months haven't been perfect. We've had our rocky days, our misunderstandings, our moments where things felt heavier than they should. But through all of it, you stayed. And I stayed.

And that choice, choosing each other even when it's not easy, means more to me than grand gestures ever could.

I don't love you because everything is smooth.
I love you because even when it isn't, I still look at you and know there's no one else I'd rather figure life out with.

Thank you for being patient with me.
Thank you for growing with me.
Thank you for loving me in ways that feel safe and real.

I don't just want you for Valentine's Day.
I want you on the random Tuesdays.
I want you during the messy days.
I want you when we're tired, when we're stressed, when we're celebrating, when we're building something bigger than just today.

I choose you, not just because it's romantic to say that.
I choose you because I mean it.

And I hope we keep choosing each other, again and again.

I love you.
Happy Valentine's Day, my favorite person 💗`,
    unlockDate: "2026-02-14",
    unlockLabel: "",
  },
];

/* Dynamically generate unlock labels from unlockDate for locked messages */
for (let i = 1; i < MESSAGES.length; i++) {
  MESSAGES[i].unlockLabel = formatUnlockLabel(MESSAGES[i].unlockDate, i);
}

/* Bottle / Envelope alternating visuals */
type ItemVisual = "bottle" | "envelope";
const ITEM_VISUALS: ItemVisual[] = [
  "bottle",
  "envelope",
  "bottle",
  "envelope",
  "bottle",
];

/* ================================================================
   Unlock logic:
   - Message 1 is ALWAYS unlocked.
   - Messages 2-5 are locked until their specific unlock date arrives
     AND the user visits the page on or after that date.
   - Unlock progress is persisted in localStorage so returning
     visitors see the same state.
   - On first visit (no saved data), only message 1 is unlocked.
   ================================================================ */
const STORAGE_KEY = "valentine-unlocked-ids";

/** Build the initial unlocked set, merging saved progress with date checks. */
function initUnlockedIds(): Set<number> {
  // Start with only message 1 unlocked
  const ids = new Set<number>([MESSAGES[0].id]);

  // Load any previously saved progress
  let savedIds: number[] = [];
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        savedIds = parsed.filter((v: unknown) => typeof v === "number");
      }
    }
  } catch {
    // Corrupted data -- ignore, start fresh
  }

  // Re-add previously unlocked messages (they stay unlocked forever)
  for (const id of savedIds) {
    ids.add(id);
  }

  // Check if any NEW messages should unlock today based on their date
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  for (const msg of MESSAGES) {
    if (msg.unlockDate <= todayStr) {
      ids.add(msg.id);
    }
  }

  // Persist the merged result
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    }
  } catch {
    // Storage full or unavailable -- graceful degradation
  }

  return ids;
}

/* ================================================================
   Main component
   ================================================================ */
export function MessagesScreen() {
  const total = MESSAGES.length;
  const [unlockedSet] = useState<Set<number>>(() => initUnlockedIds());
  const [openMessageId, setOpenMessageId] = useState<number | null>(null);
  const [shakenId, setShakenId] = useState<number | null>(null);

  const unlockedCount = unlockedSet.size;
  const allDone = unlockedCount >= total;

  /* Close modal */
  const handleCloseModal = useCallback(() => {
    setOpenMessageId(null);
  }, []);

  /* Click item */
  const handleClickItem = useCallback(
    (msg: ValentineMessage) => {
      if (unlockedSet.has(msg.id)) {
        setOpenMessageId(msg.id);
      } else {
        // Shake the locked item briefly
        setShakenId(msg.id);
        setTimeout(() => setShakenId(null), 600);
      }
    },
    [unlockedSet],
  );

  const openMessage = MESSAGES.find((m) => m.id === openMessageId) ?? null;
  const openIndex = openMessage
    ? MESSAGES.findIndex((m) => m.id === openMessage.id)
    : -1;

  return (
    <main
      className="relative flex min-h-dvh flex-col items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, hsl(350,50%,96%), hsl(340,40%,92%))",
      }}
    >
      <FloatingHearts />
      {allDone && <Confetti />}

      {/* ── Header ── */}
      <div className="z-10 flex flex-col items-center gap-2 pt-10 pb-2 px-4 animate-fade-in-down">
        <h2
          className="text-2xl font-extrabold tracking-tight md:text-3xl text-center text-balance"
          style={{ color: "hsl(340,70%,45%)" }}
        >
          {"Quest unlocked"}
        </h2>
        <p
          className="text-sm font-medium text-center max-w-xs"
          style={{ color: "hsl(340,40%,60%)" }}
        >
          {"Each day brings you closer to the final surprise."}
        </p>

        {/* Heart progress meter */}
        <div className="mt-3">
          <HeartProgress
            unlocked={unlockedCount}
            total={total}
            allDone={allDone}
          />
        </div>
      </div>

      {/* ── Quest items grid ── */}
      <div className="z-10 grid grid-cols-2 gap-5 px-6 py-6 w-full max-w-md">
        {MESSAGES.map((msg, i) => {
          const isUnlocked = unlockedSet.has(msg.id);
          const visual = ITEM_VISUALS[i % ITEM_VISUALS.length];
          return (
            <MessageItem
              key={msg.id}
              index={i}
              visual={visual}
              unlocked={isUnlocked}
              unlockLabel={msg.unlockLabel}
              shaking={shakenId === msg.id}
              onClick={() => handleClickItem(msg)}
            />
          );
        })}
      </div>

      {/* ── Modal ── */}
      {openMessage && openMessage.id === 5 ? (
        <FinalMessageModal
          content={openMessage.content}
          onClose={handleCloseModal}
        />
      ) : (
        openMessage && (
          <MessageModal
            content={openMessage.content}
            index={openIndex}
            total={total}
            onClose={handleCloseModal}
          />
        )
      )}

      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out both;
        }
      `}</style>
    </main>
  );
}

/* ══════════════════════════════════════════
   Individual bottle / envelope item
   ══════════════════════════════════════════ */
interface MessageItemProps {
  index: number;
  visual: "bottle" | "envelope";
  unlocked: boolean;
  unlockLabel: string;
  shaking: boolean;
  onClick: () => void;
}

function MessageItem({
  index,
  visual,
  unlocked,
  unlockLabel,
  shaking,
  onClick,
}: MessageItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative flex flex-col items-center justify-center gap-2 
        rounded-2xl p-6 transition-all duration-500
        ${unlocked ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-pointer"}
        ${shaking ? "animate-shake" : ""}
      `}
      style={{
        background: unlocked
          ? "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(252,212,228,0.45))"
          : "linear-gradient(135deg, rgba(220,215,220,0.5), rgba(200,195,205,0.35))",
        backdropFilter: "blur(12px)",
        border: unlocked
          ? "1px solid rgba(255,255,255,0.6)"
          : "1px solid rgba(200,195,205,0.4)",
        boxShadow: unlocked
          ? "0 8px 32px rgba(233,130,170,0.18)"
          : "0 4px 16px rgba(0,0,0,0.05)",
        opacity: unlocked ? 1 : 0.85,
      }}
      aria-label={
        unlocked
          ? `Open message ${index + 1}`
          : `Message ${index + 1} locked — ${unlockLabel}`
      }
    >
      {/* Unlocked glow ring */}
      {unlocked && (
        <div
          className="absolute inset-0 rounded-2xl animate-glow-ring"
          style={{
            border: "2px solid hsl(340,60%,72%)",
            opacity: 0.5,
          }}
        />
      )}

      {/* Icon */}
      {visual === "bottle" ? (
        <BottleSVG unlocked={unlocked} />
      ) : (
        <EnvelopeSVG unlocked={unlocked} />
      )}

      {/* Unlocked: simple label */}
      {unlocked && (
        <span
          className="text-xs font-bold text-center leading-tight"
          style={{ color: "hsl(340,50%,45%)" }}
        >
          {`Message ${index + 1}`}
        </span>
      )}

      {/* Locked: lock icon + unlock date text below */}
      {!unlocked && (
        <div className="flex flex-col items-center gap-2 mt-1">
          {/* Lock icon */}
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            fill="none"
            stroke="hsl(340,30%,50%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>

          {/* Unlock date label */}
          <span
            className="text-xs font-bold text-center leading-snug"
            style={{ color: "hsl(340,40%,45%)" }}
          >
            {unlockLabel}
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes glow-ring {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.65;
          }
        }
        .animate-glow-ring {
          animation: glow-ring 2.5s ease-in-out infinite;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          15% {
            transform: translateX(-4px);
          }
          30% {
            transform: translateX(4px);
          }
          45% {
            transform: translateX(-3px);
          }
          60% {
            transform: translateX(3px);
          }
          75% {
            transform: translateX(-2px);
          }
          90% {
            transform: translateX(2px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </button>
  );
}

/* ── SVG Icons ── */

function BottleSVG({ unlocked }: { unlocked: boolean }) {
  const color = unlocked ? "hsl(340,55%,55%)" : "hsl(340,15%,65%)";
  return (
    <svg
      viewBox="0 0 48 64"
      className={`w-12 h-16 ${unlocked ? "animate-wiggle" : ""}`}
    >
      {/* Bottle body */}
      <path
        d="M18,20 C18,16 20,14 20,10 L28,10 C28,14 30,16 30,20 L32,50 C32,56 28,58 24,58 C20,58 16,56 16,50 Z"
        fill={
          unlocked ? "rgba(252,212,228,0.6)" : "rgba(200,200,210,0.4)"
        }
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Cork */}
      <rect
        x="20"
        y="6"
        width="8"
        height="5"
        rx="1"
        fill={color}
        opacity="0.7"
      />
      {/* Heart inside bottle */}
      {unlocked && (
        <g transform="translate(24,38) scale(0.5)">
          <path
            d="M0,6 C0,-2 -12,-2 -12,6 C-12,14 0,20 0,20 C0,20 12,14 12,6 C12,-2 0,-2 0,6Z"
            fill="hsl(340,65%,60%)"
          />
        </g>
      )}
      {/* Glass shine */}
      <path
        d="M20,22 Q19,35 20,48"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <style jsx>{`
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-3deg);
          }
          75% {
            transform: rotate(3deg);
          }
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
}

function EnvelopeSVG({ unlocked }: { unlocked: boolean }) {
  const color = unlocked ? "hsl(340,55%,55%)" : "hsl(340,15%,65%)";
  return (
    <svg
      viewBox="0 0 56 44"
      className={`w-14 h-11 ${unlocked ? "animate-wiggle-env" : ""}`}
    >
      {/* Envelope body */}
      <rect
        x="2"
        y="8"
        width="52"
        height="34"
        rx="4"
        fill={
          unlocked ? "rgba(252,212,228,0.6)" : "rgba(200,200,210,0.4)"
        }
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Flap */}
      <path
        d="M2,8 L28,26 L54,8"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Heart seal */}
      {unlocked && (
        <g transform="translate(28,28) scale(0.35)">
          <path
            d="M0,6 C0,-2 -12,-2 -12,6 C-12,14 0,20 0,20 C0,20 12,14 12,6 C12,-2 0,-2 0,6Z"
            fill="hsl(340,65%,60%)"
          />
        </g>
      )}

      <style jsx>{`
        @keyframes wiggle-env {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-2deg);
          }
          75% {
            transform: rotate(2deg);
          }
        }
        .animate-wiggle-env {
          animation: wiggle-env 2.4s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
}
