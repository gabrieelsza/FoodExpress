import { useState, useEffect } from 'react';
import { Flame, Sparkles } from 'lucide-react';

const LOADING_PHRASES = [
  'Aquecendo as brasas da grelha...',
  'Selecionando cortes nobres e blends 180g...',
  'Preparando a autêntica experiência steakhouse...',
  'Bem-vindo ao FoodExpress!',
];

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock scroll during loading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Progress counter animation
    const startTime = performance.now();
    const duration = 1500; // 1.5s total loading experience

    let animationFrame;
    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      // Ease progress slightly for natural feel
      setProgress(rawProgress);

      if (rawProgress < 30) {
        setPhraseIndex(0);
      } else if (rawProgress < 65) {
        setPhraseIndex(1);
      } else if (rawProgress < 95) {
        setPhraseIndex(2);
      } else {
        setPhraseIndex(3);
      }

      if (elapsed < duration) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Short pause at 100% before initiating exit curtain
        setTimeout(() => {
          setIsExiting(true);
          // Complete exit transition after 650ms
          setTimeout(() => {
            setIsDone(true);
            document.body.style.overflow = originalOverflow;
            if (onFinish) onFinish();
          }, 650);
        }, 220);
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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090706] text-white transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] select-none pointer-events-auto ${
        isExiting
          ? '-translate-y-full opacity-90'
          : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Background Ambience: Subtle Warm Charcoal Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.14)_0%,rgba(9,7,6,0.98)_70%)] pointer-events-none" />

      {/* Decorative Warm Top & Bottom Gradients */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      {/* Center Content Box */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center space-y-6">
        {/* Pulsing Brand Emblem */}
        <div className="relative flex items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-orange-600/30 via-amber-500/20 to-red-600/30 blur-xl animate-pulse" />

          {/* Central Logo Circle */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-black border-2 border-orange-500/60 shadow-2xl shadow-orange-950/80">
            <Flame size={36} className="text-[#ea580c] fill-[#ea580c] animate-bounce" />
            <Sparkles size={16} className="absolute top-2 right-2 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider font-['Oswald',sans-serif] leading-none">
            Food<span className="bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent">Express</span>
          </h1>
          <p className="text-[11px] font-bold text-amber-500/90 tracking-[0.25em] uppercase font-['Oswald',sans-serif]">
            Steakhouse &amp; Artisan Burgers
          </p>
        </div>

        {/* Loading Progress Bar & Percentage */}
        <div className="w-full space-y-2.5 pt-2">
          {/* Percentage Counter */}
          <div className="flex items-center justify-between text-xs font-['Oswald',sans-serif] text-stone-400 uppercase tracking-widest px-0.5">
            <span className="text-stone-500 flex items-center gap-1.5 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
              Carregando
            </span>
            <span className="text-amber-400 font-bold text-sm tracking-wider tabular-nums font-mono">
              {progress}%
            </span>
          </div>

          {/* Progress Track */}
          <div className="h-1.5 w-full bg-[#1c1613] rounded-full overflow-hidden border border-[#33261e] p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(234,88,12,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Theme Phrase with soft fade */}
          <p className="text-xs text-stone-400 font-medium h-5 flex items-center justify-center transition-all duration-300">
            {LOADING_PHRASES[phraseIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
