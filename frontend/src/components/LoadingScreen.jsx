import { useState, useEffect } from 'react';

/**
 * LoadingScreen (Convertecom Style Preloader)
 * Faithfully mirrors the exact design and animation system of https://convertecom.com.br/convert-drop:
 * 1. Centered SVG Brand Mark with dynamic orbiting track
 * 2. Dual-layer Typographic Name with left-to-right sweep fill (Ghost text -> Color sweep)
 * 3. 140px x 3px Minimalist Pill Progress Bar
 * 4. Zero percentage numbers (no %) and zero neon/electric glow
 * 5. Smooth translateY(-40px) + opacity fade-out exit transition
 */
export default function LoadingScreen({ onFinish }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock scroll during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 1.2s total presentation time before initiating exit
    const timer = setTimeout(() => {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        setIsDone(true);
        document.body.style.overflow = originalOverflow;
        if (onFinish) onFinish();
      }, 600);
      return () => clearTimeout(exitTimer);
    }, 1150);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, [onFinish]);

  if (isDone) return null;

  return (
    <div
      role="status"
      aria-label="Carregando FoodExpress"
      className={`fixed inset-0 z-[9999] grid place-items-center bg-[#090807] text-white select-none transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 -translate-y-10 pointer-events-none'
          : 'opacity-100 translate-y-0 pointer-events-auto'
      }`}
    >
      <div className="grid justify-items-center gap-5 text-center">
        {/* 1. BRAND MARK WITH ORBITING PATH (Convertecom Style) */}
        <svg
          className="w-28 sm:w-36 h-auto overflow-visible"
          viewBox="0 0 500 500"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="tc-orbit-back">
              <rect x="0" y="0" width="500" height="260" />
            </clipPath>
            <clipPath id="tc-orbit-front">
              <rect x="0" y="260" width="500" height="240" />
            </clipPath>
            <linearGradient id="tc-flame-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="tc-orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Back half of the orbit */}
          <g clipPath="url(#tc-orbit-back)">
            <path
              d="M48,272 A202,80 0 0 0 452,272 A202,80 0 0 0 48,272 Z"
              pathLength="100"
              fill="none"
              stroke="#1b1512"
              strokeWidth="16"
            />
            <path
              d="M48,272 A202,80 0 0 0 452,272 A202,80 0 0 0 48,272 Z"
              pathLength="100"
              fill="none"
              stroke="url(#tc-orbit-grad)"
              strokeWidth="10"
              strokeDasharray="35 65"
              className="animate-[tc-orbit_1.5s_linear_infinite]"
            />
          </g>

          {/* Center Brand Emblem: Steakhouse Shield & Flame */}
          <g>
            {/* Outer Hex/Circle Medal */}
            <circle
              cx="250"
              cy="250"
              r="115"
              fill="#120e0b"
              stroke="#382b22"
              strokeWidth="6"
            />
            <circle
              cx="250"
              cy="250"
              r="95"
              fill="#0a0807"
              stroke="#241b16"
              strokeWidth="3"
            />

            {/* Stylized Steakhouse Crossed Cleavers / Flame */}
            <path
              d="M250,175 C230,210 205,235 205,270 C205,295 225,315 250,315 C275,315 295,295 295,270 C295,235 270,210 250,175 Z"
              fill="url(#tc-flame-grad)"
            />
            <path
              d="M250,220 C240,240 230,252 230,272 C230,285 240,295 250,295 C260,295 270,285 270,272 C270,252 260,240 250,220 Z"
              fill="#ffedd5"
              opacity="0.95"
            />
          </g>

          {/* Front half of the orbit */}
          <g clipPath="url(#tc-orbit-front)">
            <path
              d="M48,272 A202,80 0 0 0 452,272 A202,80 0 0 0 48,272 Z"
              pathLength="100"
              fill="none"
              stroke="#1b1512"
              strokeWidth="16"
            />
            <path
              d="M48,272 A202,80 0 0 0 452,272 A202,80 0 0 0 48,272 Z"
              pathLength="100"
              fill="none"
              stroke="url(#tc-orbit-grad)"
              strokeWidth="10"
              strokeDasharray="35 65"
              className="animate-[tc-orbit_1.5s_linear_infinite]"
            />
          </g>
        </svg>

        {/* 2. DUAL-LAYER BRAND TYPOGRAPHY (Convertecom Style: Ghost Underlay + Linear Fill Sweep) */}
        <div className="relative font-['Oswald',sans-serif] text-2xl sm:text-3xl font-black uppercase tracking-[0.16em] leading-none whitespace-nowrap">
          {/* Faint Ghost text layer */}
          <span className="text-white/15 select-none">
            Food<span>Express</span>
          </span>

          {/* Foreground Fill layer with sweep clip-path animation */}
          <span className="absolute inset-0 animate-[tc-name_900ms_cubic-bezier(0.16,1,0.3,1)_forwards] overflow-hidden">
            <span className="text-white">Food</span>
            <span className="text-[#ea580c]">Express</span>
          </span>
        </div>

        {/* Subtitle tag */}
        <p className="text-[10px] font-bold text-[#a8825c] tracking-[0.3em] uppercase font-['Oswald',sans-serif] -mt-2">
          Steakhouse &amp; Artisan Burgers
        </p>

        {/* 3. MINIMALIST 140px x 3px PILL PROGRESS BAR (Convertecom Style) */}
        <div className="w-[140px] h-[3px] rounded-full bg-white/10 overflow-hidden relative">
          <div className="h-full w-full bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#ea580c] origin-left animate-[tc-bar_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]" />
        </div>
      </div>
    </div>
  );
}
