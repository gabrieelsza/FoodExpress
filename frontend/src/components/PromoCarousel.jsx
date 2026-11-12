import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Bike, Flame, UtensilsCrossed, ArrowRight } from 'lucide-react';

const PROMO_SLIDES = [
  {
    id: 'combo-artesanal',
    badge: 'COMBO ESPECIAL DO CHEF',
    badgeIcon: Sparkles,
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    title: 'X-Burger + Fritas + Refri',
    subtitle: 'O combo clássico mais pedido: blend 180g na brasa, queijo cheddar derretido, batatas crocantes e bebida gelada.',
    originalPrice: 'R$ 55,70',
    promoPrice: 'R$ 44,90',
    saveText: 'Economize R$ 10,80',
    ctaText: 'Pedir Este Combo',
    productId: 1, // X-Burger Artesanal
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=500&fit=crop',
    gradient: 'from-orange-950/80 via-neutral-900/90 to-neutral-950',
    glowColor: 'rgba(249, 115, 22, 0.15)',
    borderAccent: 'border-orange-500/30',
  },
  {
    id: 'smash-triplo',
    badge: 'LANÇAMENTO DA BRASA',
    badgeIcon: Flame,
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    title: 'Smash Burger com Queijo Duplo',
    subtitle: 'Crosta crocante caramelizada na chapa, dobro de cheddar cremoso e fatias generosas de bacon defumado.',
    originalPrice: null,
    promoPrice: 'A partir de R$ 28,90',
    saveText: 'Preparo 100% artesanal',
    ctaText: 'Ver Detalhes',
    productId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=500&fit=crop',
    gradient: 'from-amber-950/80 via-neutral-900/90 to-neutral-950',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    borderAccent: 'border-amber-500/30',
  },
  {
    id: 'frete-gratis',
    badge: 'VANTAGEM EXCLUSIVA',
    badgeIcon: Bike,
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    title: 'Entrega Grátis Acima de R$ 60',
    subtitle: 'Monte seu pedido na hamburgueria e receba no conforto da sua casa com taxa de entrega totalmente zerada.',
    originalPrice: null,
    promoPrice: 'Frete R$ 0,00',
    saveText: 'Válido para todo o cardápio',
    ctaText: 'Aproveitar Oferta',
    categoryId: 1, // Lanches
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=500&fit=crop',
    gradient: 'from-emerald-950/70 via-neutral-900/90 to-neutral-950',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    borderAccent: 'border-emerald-500/30',
  },
  {
    id: 'sobremesa-premium',
    badge: 'DOCE PERFEITO',
    badgeIcon: UtensilsCrossed,
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    title: 'Brownie Quente com Sorvete',
    subtitle: 'Finalize sua experiência com brownie denso de chocolate belga, calda quente e sorvete artesanal de creme.',
    originalPrice: 'R$ 24,90',
    promoPrice: 'R$ 19,90',
    saveText: 'Sobremesa favorita',
    ctaText: 'Pedir Sobremesa',
    productId: 11, // Brownie com Sorvete
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=500&fit=crop',
    gradient: 'from-rose-950/70 via-neutral-900/90 to-neutral-950',
    glowColor: 'rgba(244, 63, 94, 0.15)',
    borderAccent: 'border-rose-500/30',
  },
];

export default function PromoCarousel({ onActionClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  }, []);

  // Auto-play timer (every 5 seconds, pauses on hover/touch)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipe = Math.abs(distance) > 50;

    if (isSwipe) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = PROMO_SLIDES[currentIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  return (
    <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-500 shadow-2xl group"
        style={{
          boxShadow: `0 10px 40px -10px ${currentSlide.glowColor}`,
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Container */}
        <div className="relative min-h-[220px] sm:min-h-[260px] md:min-h-[280px] flex items-center">
          {PROMO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const SlideIcon = slide.badgeIcon;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-col md:flex-row items-center justify-between ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                } bg-gradient-to-r ${slide.gradient} ${slide.borderAccent}`}
              >
                {/* Background Ambient Glow & Mobile-only Subtle Texture */}
                <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 h-full overflow-hidden pointer-events-none">
                  <div className="md:hidden absolute inset-0">
                    <img
                      src={slide.imageUrl}
                      alt=""
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a] via-[#0e0c0a]/80 to-transparent" />
                  </div>
                  <div className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl" />
                  <div className="hidden md:block absolute right-4 top-4 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl" />
                </div>

                {/* Left Content Column */}
                <div className="relative z-10 w-full md:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-3 sm:space-y-4">
                  {/* Category / Promo Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border shadow-sm font-['Oswald',sans-serif] ${slide.badgeColor}`}
                    >
                      <SlideIcon size={13} className="shrink-0" />
                      {slide.badge}
                    </span>
                    {slide.saveText && (
                      <span className="text-[11px] font-semibold text-stone-400 hidden sm:inline-block">
                        • {slide.saveText}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight font-['Oswald',sans-serif] uppercase">
                    {slide.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>

                  {/* Price & CTA Button */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <div className="flex items-baseline gap-2">
                      {slide.originalPrice && (
                        <span className="text-xs sm:text-sm text-stone-500 line-through">
                          {slide.originalPrice}
                        </span>
                      )}
                      <span className="text-lg sm:text-2xl font-black text-amber-400 tracking-tight font-['Oswald',sans-serif]">
                        {slide.promoPrice}
                      </span>
                    </div>

                    <button
                      onClick={() => onActionClick && onActionClick(slide)}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider font-['Oswald',sans-serif] shadow-lg shadow-orange-950/60 transition-all cursor-pointer"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right Hero Food Image (100% straight, clean border, no rotation / no tilt) */}
                <div className="hidden md:flex relative z-10 w-2/5 h-full items-center justify-center p-6 sm:p-8 pr-12">
                  <div className="relative w-56 h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border border-[#3d2e24] shadow-2xl bg-[#0c0a08]">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Slide anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 hover:bg-orange-500 text-white border border-white/15 backdrop-blur-md transition-all shadow-lg opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Próximo slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 hover:bg-orange-500 text-white border border-white/15 backdrop-blur-md transition-all shadow-lg opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
          {PROMO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir para o slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-orange-500 shadow-sm' : 'w-2 bg-neutral-600 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
