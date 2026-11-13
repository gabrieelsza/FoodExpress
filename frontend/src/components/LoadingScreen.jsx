import { useState, useEffect } from 'react';

/**
 * High-End Steakhouse Preloader
 * Minimalist, elegant, quiet-luxury loading experience:
 * - No percentage numbers
 * - No neon glows or cartoon bounces
 * - Refined hairline progress and cinematic focus-out dissolve
 */
export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock scroll during initial load
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    const duration = 1350; // Smooth 1.35s total load

    let animationFrame;
    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      // Natural cubic deceleration for smooth fill
      const eased = Math.min(100, Math.round((1 - Math.pow(1 - t, 2.5)) * 100));

      setProgress(eased);

      if (t < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Short pause at 100% before cinematic dissolve
        setTimeout(() => {
          setIsExiting(true);
          // Complete transition after 600ms
          setTimeout(() => {
            setIsDone(true);
            document.body.style.overflow = originalOverflow;
            if (onFinish) onFinish();
          }, 600);
        }, 180);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.body.style.overflow = originalOverflow;
    };
  }, [onFinish]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090706] text-stone-100 select-none pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 scale-[1.03] pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle hairline edge borders */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3a2c22] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#2b211a] to-transparent" />

      {/* Main Center Brand Card */}
      <div className="relative z-10 flex flex-col items-center max-w-xs w-full px-6 text-center space-y-5">
        {/* Official Brand Logo with Fine Bronze Border */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black border border-[#3d2e24] shadow-xl overflow-hidden">
          <img
            src="/logo.jpg"
            alt="FoodExpress"
            className="w-full h-full object-cover scale-105"
          />
        </div>

        {/* Clean Typographic Identity */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] font-['Oswald',sans-serif] text-white leading-tight">
            Food<span className="text-[#ea580c]">Express</span>
          </h1>
          <p className="text-[10px] font-bold text-[#b48c65] tracking-[0.3em] uppercase font-['Oswald',sans-serif]">
            Steakhouse &amp; Artisan Burgers
          </p>
        </div>

        {/* Minimalist Hairline Progress Track (No % numbers, No neon) */}
        <div className="w-44 space-y-3 pt-2">
          {/* 1.5px Hairline Progress Bar */}
          <div className="h-[2px] w-full bg-[#1e1713] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9a3412] via-[#ea580c] to-[#d97706] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Understated Status Text */}
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400 font-['Oswald',sans-serif]">
            {progress < 100 ? 'Carregando experiência' : 'Sabor da brasa'}
          </p>
        </div>
      </div>
    </div>
  );
}
