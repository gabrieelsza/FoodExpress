import { useState, useEffect } from 'react';

/**
 * LoadingScreen (Convertecom Style Preloader)
 * Faithfully mirrors the exact design and animation system of https://convertecom.com.br/convert-drop:
 * 1. Centered SVG Brand Mark with dynamic orbiting track & Artisan Burger
 * 2. Dual-layer Typographic Name with left-to-right sweep fill (Ghost text -> Color sweep)
 * 3. 140px x 3px Minimalist Pill Progress Bar
 * 4. Zero percentage numbers (no %) and zero neon/electric glow
 * 5. Smooth translateY(-40px) + opacity fade-out exit transition
 */
export default function LoadingScreen({ onFinish, isRouteChange = false }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock scroll during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Snappier on route changes (750ms total), full on initial load (1100ms)
    const holdDuration = isRouteChange ? 600 : 1050;
    const exitDuration = isRouteChange ? 450 : 550;

    const timer = setTimeout(() => {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        setIsDone(true);
        document.body.style.overflow = originalOverflow;
        if (onFinish) onFinish();
      }, exitDuration);
      return () => clearTimeout(exitTimer);
    }, holdDuration);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, [onFinish, isRouteChange]);

  if (isDone) return null;

  return (
    <div
      role="status"
      aria-label="Carregando FoodExpress"
      className={`fixed inset-0 z-[9999] grid place-items-center bg-[#090807] text-white select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 -translate-y-10 pointer-events-none'
          : 'opacity-100 translate-y-0 pointer-events-auto'
      }`}
    >
      <div className="grid justify-items-center gap-5 text-center">
        {/* 1. BRAND MARK WITH ORBITING PATH & ARTISAN BURGER (Convertecom Style) */}
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
            <linearGradient id="tc-orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            {/* Gradients for Artisan Burger */}
            <linearGradient id="tc-bun-top" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="tc-cheddar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="tc-patty" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id="tc-bun-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
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

          {/* Center Brand Emblem: Medallion with Artisan Burger */}
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

            {/* ARTISAN BURGER ICON */}
            {/* 1. Top Brioche Bun */}
            <path
              d="M196,220 C196,182 218,168 250,168 C282,168 304,182 304,220 C304,224 196,224 196,220 Z"
              fill="url(#tc-bun-top)"
            />

            {/* Sesame Seeds on Top Bun */}
            <ellipse cx="230" cy="190" rx="3.5" ry="1.8" transform="rotate(-20 230 190)" fill="#fef3c7" opacity="0.9" />
            <ellipse cx="250" cy="182" rx="3.5" ry="1.8" transform="rotate(5 250 182)" fill="#fef3c7" opacity="0.9" />
            <ellipse cx="270" cy="192" rx="3.5" ry="1.8" transform="rotate(25 270 192)" fill="#fef3c7" opacity="0.9" />
            <ellipse cx="240" cy="205" rx="3" ry="1.6" transform="rotate(10 240 205)" fill="#fef3c7" opacity="0.85" />
            <ellipse cx="262" cy="204" rx="3" ry="1.6" transform="rotate(-15 262 204)" fill="#fef3c7" opacity="0.85" />

            {/* 2. Melted Cheddar & Lettuce Waves */}
            <path
              d="M192,230 C200,237 208,239 216,233 C226,242 238,245 248,236 C258,244 270,246 282,234 C292,242 302,238 308,230 L308,227 L192,227 Z"
              fill="url(#tc-cheddar)"
            />

            {/* 3. Juicy Grilled Blend 180g Patty */}
            <rect
              x="190"
              y="242"
              width="120"
              height="22"
              rx="8"
              fill="url(#tc-patty)"
            />
            {/* Subtle Grill marks */}
            <line x1="218" y1="246" x2="226" y2="260" stroke="#291203" strokeWidth="2" strokeLinecap="round" />
            <line x1="246" y1="246" x2="254" y2="260" stroke="#291203" strokeWidth="2" strokeLinecap="round" />
            <line x1="274" y1="246" x2="282" y2="260" stroke="#291203" strokeWidth="2" strokeLinecap="round" />

            {/* 4. Bottom Brioche Bun */}
            <path
              d="M196,270 L304,270 C304,272 304,286 288,296 C274,302 226,302 212,296 C196,286 196,272 196,270 Z"
              fill="url(#tc-bun-bottom)"
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
          <span
            className="absolute inset-0 overflow-hidden"
            style={{
              animation: `tc-name ${isRouteChange ? '550ms' : '850ms'} cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            }}
          >
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
          <div
            className="h-full w-full bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#ea580c] origin-left"
            style={{
              animation: `tc-bar ${isRouteChange ? '650ms' : '950ms'} cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
