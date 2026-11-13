import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Bike, Flame, UtensilsCrossed, ArrowRight } from 'lucide-react';

const PROMO_SLIDES = [
  {
    id: 'combo-artesanal',
    badge: 'COMBO ESPECIAL DO CHEF',
    badgeIcon: Sparkles,
    title: 'X-Burger + Fritas + Refri',
    subtitle: 'O combo clássico mais pedido: blend 180g na brasa, queijo cheddar derretido, batatas crocantes e bebida gelada.',
    originalPrice: 'R$ 55,70',
    promoPrice: 'R$ 44,90',
    saveText: 'Economize R$ 10,80',
    ctaText: 'Pedir Este Combo',
    productId: 1, // X-Burger Artesanal
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=1000&h=700&fit=crop',
  },
  {
    id: 'smash-triplo',
    badge: 'LANÇAMENTO DA BRASA',
    badgeIcon: Flame,
    title: 'Smash Burger com Queijo Duplo',
    subtitle: 'Crosta crocante caramelizada na chapa, dobro de cheddar cremoso e fatias generosas de bacon defumado.',
    originalPrice: null,
    promoPrice: 'A partir de R$ 28,90',
    saveText: 'Preparo 100% artesanal',
    ctaText: 'Ver Detalhes',
    productId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&h=700&fit=crop',
  },
  {
    id: 'frete-gratis',
    badge: 'VANTAGEM EXCLUSIVA',
    badgeIcon: Bike,
    title: 'Entrega Grátis Acima de R$ 60',
    subtitle: 'Monte seu pedido na hamburgueria e receba no conforto da sua casa com taxa de entrega totalmente zerada.',
    originalPrice: null,
    promoPrice: 'Frete R$ 0,00',
    saveText: 'Válido para todo o cardápio',
    ctaText: 'Aproveitar Oferta',
    categoryId: 1, // Lanches
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&h=700&fit=crop',
  },
  {
    id: 'sobremesa-premium',
    badge: 'DOCE PERFEITO',
    badgeIcon: UtensilsCrossed,
    title: 'Brownie Quente com Sorvete',
    subtitle: 'Finalize sua experiência com brownie denso de chocolate belga, calda quente cremosa e sorvete artesanal.',
    originalPrice: 'R$ 24,90',
    promoPrice: 'R$ 19,90',
    saveText: 'Sobremesa favorita',
    ctaText: 'Pedir Sobremesa',
    productId: 11, // Brownie com Sorvete
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1000&h=700&fit=crop',
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
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-800 bg-[#121214] shadow-xl shadow-black/60 group transition-all duration-300 hover:border-zinc-700"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Container */}
        <div className="relative h-[280px] sm:h-[300px] md:h-[320px] flex items-stretch">
          {PROMO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const SlideIcon = slide.badgeIcon;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-col md:flex-row items-stretch justify-between ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                } bg-[#121214]`}
              >
                {/* Left Content Column */}
                <div className="relative z-10 w-full md:w-3/5 lg:w-7/12 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-3 sm:space-y-4">
                  {/* Category / Promo Badge (Unified Steakhouse Theme) */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-800 shadow-sm font-['Oswald',sans-serif]">
                      <SlideIcon size={12} className="text-orange-500 shrink-0" />
                      {slide.badge}
                    </span>
                    {slide.saveText && (
                      <span className="text-[11px] font-semibold text-stone-400 hidden sm:inline-block">
                        • {slide.saveText}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight font-['Oswald',sans-serif] uppercase drop-shadow-sm">
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
                        <span className="text-xs sm:text-sm text-stone-500 line-through font-semibold">
                          {slide.originalPrice}
                        </span>
                      )}
                      <span className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-100 tracking-tight font-['Oswald',sans-serif]">
                        {slide.promoPrice}
                      </span>
                    </div>

                    <button
                      onClick={() => onActionClick && onActionClick(slide)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c2410c] hover:bg-[#d9531e] active:scale-95 text-white font-bold text-xs uppercase tracking-wider font-['Oswald',sans-serif] shadow-md shadow-black/50 transition-all cursor-pointer"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right Food Photo (Seamless full-height bleed with feathered blend) */}
                <div className="relative w-full md:w-2/5 lg:w-5/12 h-full overflow-hidden bg-black shrink-0">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out hover:scale-105"
                  />
                  {/* Seamless feathered blend from right photo to left text */}
                  <div className="hidden md:block absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#121214] via-[#121214]/70 to-transparent pointer-events-none z-10" />
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  {/* Mobile dark overlay */}
                  <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/85 to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Slide anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/70 hover:bg-orange-600 text-zinc-300 hover:text-white border border-zinc-800 backdrop-blur-md transition-all shadow-xl opacity-90 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Próximo slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/70 hover:bg-orange-600 text-zinc-300 hover:text-white border border-zinc-800 backdrop-blur-md transition-all shadow-xl opacity-90 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-md">
          {PROMO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir para o slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-orange-600'
                  : 'w-2 bg-zinc-700 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
