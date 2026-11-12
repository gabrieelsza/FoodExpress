import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Flame,
  Sparkles,
  Bike,
  UtensilsCrossed,
  Clock,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatPrice } from '../utils/helpers';

const HERO_SLIDES = [
  {
    id: 'slide-cafe-brasa',
    badge: 'EXPERIÊNCIA EXCLUSIVA FOODEXPRESS',
    tag: 'AGORA TEM O VERDADEIRO SABOR DA BRASA',
    title: 'Cortes Nobres & Artisan Burgers',
    subtitle: 'Blends nobres 180g preparados no fogo com queijo cheddar fundido, batatas crocantes e molhos autorais da casa.',
    schedule: 'TERÇA A DOMINGO DAS 18H00 ÀS 23H30 · SALÃO & DELIVERY',
    ctaText: 'VER CARDÁPIO COMPLETO',
    ctaSubText: 'FAZER MEU PEDIDO AGORA',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=900&fit=crop',
    photoAlt: 'Mesa repleta de hambúrgueres artesanais, porções e amigos comemorando no FoodExpress',
    accentColor: 'from-orange-600 to-amber-500',
  },
  {
    id: 'slide-aussie-combos',
    badge: 'FESTIVAL DE COMBOS & PORÇÕES',
    tag: 'PORÇÕES GENEROSAS PARA COMPARTILHAR',
    title: 'Aussie Fries & Bloomin\' Onion',
    subtitle: 'Batatas rústicas com cheddar cremoso e bacon crocante, anéis de cebola dourados e molhos especiais para mergulhar.',
    schedule: 'O ACOMPANHAMENTO PERFEITO PARA QUALQUER PEDIDO',
    ctaText: 'VER NOSSOS PRODUTOS',
    ctaSubText: 'VER PORÇÕES DISPONÍVEIS',
    photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=900&fit=crop',
    photoAlt: 'Costela grelhada com batatas rústicas e porções generosas na mesa',
    accentColor: 'from-red-600 to-orange-500',
  },
  {
    id: 'slide-sobremesa-thunder',
    badge: 'DOCE ENCERRAMENTO DA NOITE',
    tag: 'A EXPERIÊNCIA COMPLETA DO STEAKHOUSE',
    title: 'Thunder Brownie com Sorvete',
    subtitle: 'Brownie quente de chocolate denso com cobertura de ganache artesanal e bola generosa de sorvete de baunilha.',
    schedule: 'A SOBREMESA MAIS AMADA E COMENTADA DA CASA',
    ctaText: 'EXPERIMENTAR SOBREMESA',
    ctaSubText: 'CARDÁPIO DE DOCES & BEBIDAS',
    photoUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200&h=900&fit=crop',
    photoAlt: 'Delicioso brownie quente com calda de chocolate e sorvete artesanal',
    accentColor: 'from-amber-600 to-yellow-500',
  },
];

const DEMO_ITEMS = [
  {
    id: 1,
    title: 'X-Burger Artesanal',
    category: 'Lanches na Brasa',
    categoryId: 1,
    description: 'Pão brioche selado na manteiga, blend bovino 180g grelhado no fogo, queijo cheddar duplo, alface, tomate e maionese autoral da casa.',
    price: 28.90,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    badge: 'O Mais Pedido',
    tags: ['Blend 180g', 'Queijo Cheddar', 'Pão Brioche', 'Na Brasa'],
  },
  {
    id: 4,
    title: 'Aussie Cheese Fries',
    category: 'Porções & Entradas',
    categoryId: 2,
    description: 'Porção generosa de batatas fritas douradas e crocantes cobertas com farta camada de queijo cheddar cremoso e cubos de bacon frito crocante.',
    price: 18.90,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop',
    badge: 'Favorito da Galera',
    tags: ['Batatas Rústicas', 'Cheddar Quente', 'Bacon Crocante'],
  },
  {
    id: 11,
    title: 'Thunder Brownie com Sorvete',
    category: 'Sobremesas Especiais',
    categoryId: 4,
    description: 'Brownie morno com textura densa de puro chocolate belga, calda quente cremosa de chocolate meio amargo e bola generosa de sorvete de baunilha.',
    price: 19.90,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop',
    badge: 'Final Perfeito',
    tags: ['Chocolate Belga', 'Calda Quente', 'Sorvete Baunilha'],
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  const handleNavigateToProducts = () => {
    navigate('/nossos-produtos');
  };

  const handleNavigateToDelivery = () => {
    navigate('/delivery');
  };

  const scrollToProducts = () => {
    const el = document.getElementById('nossos-produtos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/nossos-produtos');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0908] text-stone-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-orange-600 flex flex-col">
      {/* 1. TOP NAVBAR (Outback Tabs: INÍCIO | NOSSOS PRODUTOS | RESTAURANTE & SALÃO | DELIVERY | ACESSO DO ATENDENTE) */}
      <Navbar isAdmin={false} />

      {/* 2. HUGE SPLIT HERO BANNER (Outback Style Seamless Cinematic Carousel) */}
      <section
        className="relative w-full h-[540px] sm:h-[600px] lg:h-[660px] bg-[#0c0a08] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides Container with Smooth Crossfade */}
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12">
                {/* Left Side: Photography with seamless organic feathered blend */}
                <div className="lg:col-span-7 relative h-[280px] sm:h-[360px] lg:h-full overflow-hidden bg-[#0c0a08]">
                  <img
                    src={slide.photoUrl}
                    alt={slide.photoAlt}
                    className={`w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                    style={{
                      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 72%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0) 100%)',
                      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 72%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0) 100%)',
                    }}
                  />

                  {/* Multi-stage Feathered Gradients for Desktop */}
                  <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/30 via-transparent 30% to-[#0c0a08] 95% pointer-events-none" />
                  <div className="hidden lg:block absolute inset-y-0 right-0 w-64 bg-gradient-to-r from-transparent via-[#0c0a08]/80 to-[#0c0a08] pointer-events-none z-10" />

                  {/* Bottom & Top feathering for Mobile & Desktop */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0c0a08] via-[#0c0a08]/70 to-transparent pointer-events-none z-10 lg:hidden" />
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10" />

                  {/* Floating Steakhouse Experience Tag */}
                  <div className="absolute top-5 left-5 z-20">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 border border-orange-500/40 text-[10px] sm:text-xs font-black uppercase font-['Oswald',sans-serif] tracking-wider shadow-xl">
                      <Flame size={12} className="text-orange-500 fill-orange-500" />
                      Steakhouse Experience
                    </span>
                  </div>
                </div>

                {/* Right Side: Seamless Dark Graphic Canvas with Warm Glow & Organic Accents */}
                <div className="lg:col-span-5 relative h-full flex flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-14 bg-gradient-to-b lg:bg-gradient-to-r from-[#0c0a08] via-[#120e0b] to-[#0a0807] text-center lg:text-left overflow-hidden">
                  {/* Hearth Fire Warm Glow behind transition */}
                  <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Subtle Outback organic curved wave lines creating fluidity */}
                  <svg
                    className="hidden lg:block absolute -left-16 top-0 bottom-0 h-full w-36 text-orange-500/20 pointer-events-none z-10"
                    viewBox="0 0 120 800"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M20,0 C90,220 10,380 80,560 C110,660 30,800 20,800"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray="6 8"
                      className="opacity-75"
                    />
                    <path
                      d="M50,0 C120,240 40,420 100,600 C130,700 60,800 50,800"
                      stroke="url(#warmGradient)"
                      strokeWidth="1.5"
                      className="opacity-50"
                    />
                    <defs>
                      <linearGradient id="warmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ea580c" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Content Container with soft stagger animation */}
                  <div className={`relative z-10 space-y-4 sm:space-y-5 transition-all duration-700 ease-out transform ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                  }`}>
                    {/* Eyebrow & Tag */}
                    <div className="space-y-1">
                      <span className="block text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-500 font-['Oswald',sans-serif]">
                        {slide.badge}
                      </span>
                      <span className="block text-[10px] sm:text-[11px] font-bold text-stone-400 tracking-wider uppercase">
                        {slide.tag}
                      </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase font-['Oswald',sans-serif] leading-[1.08] drop-shadow-md">
                      {slide.title}
                    </h1>

                    {/* Subtitle / Description */}
                    <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto lg:mx-0 leading-relaxed">
                      {slide.subtitle}
                    </p>

                    {/* Operating / Info Tag */}
                    <div className="inline-block px-3 py-1 rounded-lg bg-[#1a1411]/90 backdrop-blur-xs border border-[#382b22] text-[11px] font-semibold text-amber-400/90 font-['Oswald',sans-serif] tracking-wider uppercase shadow-md">
                      {slide.schedule}
                    </div>

                    {/* Big Prominent Outback Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                      <button
                        onClick={handleNavigateToProducts}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 active:scale-95 text-white font-black text-sm uppercase tracking-wider font-['Oswald',sans-serif] shadow-xl shadow-orange-950/80 transition-all cursor-pointer"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight size={17} />
                      </button>

                      <button
                        onClick={scrollToProducts}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#171310]/90 hover:bg-[#201a15] border border-[#382c23] hover:border-orange-500/70 text-stone-300 hover:text-white font-bold text-xs uppercase tracking-wider font-['Oswald',sans-serif] transition-colors cursor-pointer"
                      >
                        <span>Explorar Produtos</span>
                      </button>
                    </div>

                    {/* Carousel Navigation Indicators & Outback Signature Seal */}
                    <div className="pt-3 border-t border-[#241d18]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black border border-orange-500/40 text-orange-500 shrink-0">
                          <UtensilsCrossed size={13} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-400 font-['Oswald',sans-serif]">
                          FOODEXPRESS STEAKHOUSE BRASIL
                        </span>
                      </div>

                      {/* Integrated Slider Dots & Controls (Never overlaps buttons!) */}
                      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#382b22] shadow-lg">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
                          }}
                          className="text-stone-400 hover:text-amber-400 transition-colors p-0.5 cursor-pointer"
                          aria-label="Slide anterior"
                        >
                          <ChevronLeft size={14} />
                        </button>

                        <div className="flex items-center gap-1.5 px-1">
                          {HERO_SLIDES.map((s, sIdx) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentSlideIndex(sIdx);
                              }}
                              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                                sIdx === currentSlideIndex
                                  ? 'w-7 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 shadow-md shadow-orange-500/50'
                                  : 'w-2 bg-stone-700 hover:bg-stone-500'
                              }`}
                              aria-label={`Ir para slide ${sIdx + 1}`}
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
                          }}
                          className="text-stone-400 hover:text-amber-400 transition-colors p-0.5 cursor-pointer"
                          aria-label="Próximo slide"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Soft Bottom Gradient Transition into Section 3 (Melts into page seamlessly!) */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0b0908] via-[#0b0908]/90 to-transparent pointer-events-none z-20" />
      </section>

      {/* 3. "NOSSOS PRODUTOS" — 3 ITENS DEMONSTRATIVOS */}
      <section id="nossos-produtos" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161210] border border-[#33261e] text-xs font-bold text-orange-400 uppercase tracking-widest font-['Oswald',sans-serif]">
            <Flame size={14} className="fill-orange-500" />
            DESTAQUES DA CASA
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wider font-['Oswald',sans-serif]">
            VIVA O SABOR FOODEXPRESS
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 mx-auto rounded-full mt-3"></div>
          <p className="text-sm sm:text-base text-stone-400 max-w-xl mx-auto pt-2 leading-relaxed">
            Três criações lendárias para você conhecer o autêntico sabor da brasa. Para ver todos os lanches, porções, chopps e sobremesas, acesse a aba <strong className="text-amber-400 font-bold">Nossos Produtos</strong>.
          </p>
        </div>

        {/* 3 Demonstrative Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {DEMO_ITEMS.map((dish) => (
            <div
              key={dish.id}
              onClick={() => navigate('/nossos-produtos')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#14110f] border border-[#2b221c] shadow-xl hover:shadow-2xl hover:shadow-orange-950/40 hover:border-orange-500/60 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              <div>
                {/* Photo with Dark Overlay */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#0c0a09]">
                  <img
                    src={dish.imageUrl}
                    alt={dish.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-transparent to-black/30 pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/90 text-amber-300 border border-red-700/60 text-[10px] font-black uppercase font-['Oswald',sans-serif] tracking-wider shadow-md">
                      {dish.badge}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-xs text-orange-400 border border-orange-500/40 text-[10px] font-bold font-['Oswald',sans-serif] uppercase tracking-wider shadow-md">
                      <Flame size={10} className="fill-orange-500" />
                      Na Brasa
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-xs text-stone-300 text-[10px] font-semibold font-['Oswald',sans-serif] uppercase tracking-wide border border-stone-800">
                      {dish.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors font-['Oswald',sans-serif] uppercase tracking-wide">
                    {dish.title}
                  </h3>

                  <p className="mt-2 text-xs text-stone-400 leading-relaxed line-clamp-3">
                    {dish.description}
                  </p>

                  {/* Ingredient Tags */}
                  {dish.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#1f1915]">
                      {dish.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#191411] border border-[#2e241d] text-[10px] font-semibold text-stone-300 font-['Oswald',sans-serif] uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-[#201a15] mt-2 pt-4">
                <div>
                  <span className="block text-[10px] font-bold text-stone-500 uppercase font-['Oswald',sans-serif]">
                    A partir de
                  </span>
                  <span className="text-xl font-black text-amber-400 font-['Oswald',sans-serif] tracking-wide">
                    {formatPrice(dish.price)}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 text-white text-xs font-black font-['Oswald',sans-serif] uppercase tracking-wider shadow-md shadow-orange-950/60 transition-all">
                  <span>Ver Detalhes</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to Full Catalog Tab */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-[#17120e] via-[#1c1612] to-[#17120e] border border-[#33261e] p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest font-['Oswald',sans-serif]">
              <UtensilsCrossed size={14} className="text-orange-500" />
              CARDÁPIO COMPLETO NAS ABAS SUPERIORES
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-wide">
              Quer ver todas as nossas opções?
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
              Acesse a aba <strong>Nossos Produtos</strong> para ver todos os cortes, lanches, porções, chopp artesanal e sobremesas com filtros e fotos detalhadas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/nossos-produtos')}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 active:scale-95 text-white font-black text-sm uppercase tracking-wider font-['Oswald',sans-serif] shadow-xl shadow-orange-950/80 transition-all cursor-pointer"
            >
              <UtensilsCrossed size={16} />
              <span>Ver Nossos Produtos</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate('/restaurante')}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#191411] hover:bg-[#221b16] border border-[#3a2d24] hover:border-orange-500/60 text-stone-200 hover:text-white font-bold text-xs uppercase tracking-wider font-['Oswald',sans-serif] transition-colors cursor-pointer"
            >
              <UtensilsCrossed size={16} className="text-orange-500" />
              <span>Conhecer o Salão</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. EXPERIENCE SECTION: SALÃO OU DELIVERY */}
      <section id="experiencia-section" className="w-full bg-[#0e0c0a] border-y border-[#241d18] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Delivery */}
            <div className="relative overflow-hidden rounded-3xl bg-[#14100e] border border-[#2b221c] p-8 sm:p-10 flex flex-col justify-between shadow-xl group">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                  <Bike size={26} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Oswald',sans-serif] uppercase tracking-wide">
                  FoodExpress na Sua Casa
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed max-w-md">
                  Faça seu pedido diretamente pelo cardápio digital sem taxas abusivas de aplicativos. Embalagens térmicas especiais garantem lanches e porções quentes e crocantes na sua porta em 30 a 45 minutos.
                </p>
              </div>

              <div className="pt-8">
                <button
                  onClick={handleNavigateToProducts}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider font-['Oswald',sans-serif] shadow-lg cursor-pointer"
                >
                  <span>Fazer Pedido Agora</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Card 2: Experiência no Salão */}
            <div className="relative overflow-hidden rounded-3xl bg-[#14100e] border border-[#2b221c] p-8 sm:p-10 flex flex-col justify-between shadow-xl group">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <UtensilsCrossed size={26} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Oswald',sans-serif] uppercase tracking-wide">
                  Experiência no Salão
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed max-w-md">
                  Venha viver o clima acolhedor do nosso steakhouse. Salão climatizado com iluminação quente, chopp artesanal servido na caneca congelada e pedidos direto na mesa com acompanhamento em tempo real.
                </p>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => navigate('/restaurante')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e1814] hover:bg-[#271f1a] border border-[#382b22] text-stone-200 hover:text-white font-bold text-xs uppercase tracking-wider font-['Oswald',sans-serif] transition-colors cursor-pointer"
                >
                  <span>Conhecer Restaurante &amp; Salão</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REVIEWS & SOCIAL PROOF */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181310] border border-[#2e231b] text-amber-400 text-xs font-bold mb-4 font-['Oswald',sans-serif] uppercase tracking-wider">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          Avaliação 4.9 de 5.0 (Mais de 500 Clientes)
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-wide">
          O Que Nossos Clientes Dizem
        </h3>
        <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto mt-2">
          A paixão pelo fogo e pela brasa refletida no prato de quem experimenta.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
          <div className="p-6 rounded-2xl bg-[#120f0d] border border-[#241d18] space-y-3">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-300 italic">
              "Lanche espetacular! A carne com gosto autêntico de brasa e o pão macio selado na manteiga. Lembra muito os burgers do Outback, mas com toque artesanal único."
            </p>
            <span className="block text-[11px] font-bold text-stone-400 font-['Oswald',sans-serif] uppercase">
              Rodrigo S. · Cliente Delivery
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#120f0d] border border-[#241d18] space-y-3">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-300 italic">
              "As batatas com cheddar e bacon são surreais, e a Bloomin' Onion é crocante demais. Pedido chegou super rápido e quente em casa."
            </p>
            <span className="block text-[11px] font-bold text-stone-400 font-['Oswald',sans-serif] uppercase">
              Camila M. · Cliente Frequente
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#120f0d] border border-[#241d18] space-y-3">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-300 italic">
              "O brownie no final é obrigatório. Atendimento impecável no salão e o cardápio digital é super rápido de pedir. 10/10."
            </p>
            <span className="block text-[11px] font-bold text-stone-400 font-['Oswald',sans-serif] uppercase">
              Lucas V. · Cliente Salão
            </span>
          </div>
        </div>
      </section>

      {/* 6. STEAKHOUSE FOOTER */}
      <footer className="w-full bg-[#090807] border-t border-[#241d18] text-stone-300 relative overflow-hidden mt-auto">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1f1915]">
            {/* Col 1: Brand & Manifesto */}
            <div className="md:col-span-6 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black border-2 border-orange-500/50 shadow-xl ring-2 ring-orange-500/20 overflow-hidden">
                  <img src="/logo.jpg" alt="FoodExpress" className="w-full h-full object-cover scale-105" />
                </div>
                <div>
                  <span className="text-2xl font-black text-white tracking-tight leading-none block font-['Oswald',sans-serif]">
                    Food<span className="bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent">Express</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-500/90 tracking-widest uppercase mt-0.5 block font-['Oswald',sans-serif]">
                    Steakhouse &amp; Artisan Burgers
                  </span>
                </div>
              </div>

              <p className="text-sm text-stone-400 max-w-lg leading-relaxed">
                Hambúrgueres artesanais preparados com cortes nobres grelhados na brasa viva, queijos fundidos e receitas autorais exclusivas no autêntico padrão steakhouse. Sabor marcante e generosidade do início ao fim.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14100d] border border-[#2d221a] text-xs font-bold text-stone-300 font-['Oswald',sans-serif] uppercase tracking-wider">
                  <Flame size={12} className="text-orange-500 fill-orange-500" /> Grelhado no Fogo
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14100d] border border-[#2d221a] text-xs font-bold text-stone-300 font-['Oswald',sans-serif] uppercase tracking-wider">
                  <Sparkles size={12} className="text-amber-400" /> Blends Nobres 180g
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14100d] border border-[#2d221a] text-xs font-bold text-stone-300 font-['Oswald',sans-serif] uppercase tracking-wider">
                  <Bike size={12} className="text-emerald-400" /> Entrega Express
                </span>
              </div>
            </div>

            {/* Col 2: Horários */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-orange-500"></div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Oswald',sans-serif]">
                  Atendimento &amp; Salão
                </h4>
              </div>

              <div className="space-y-3 text-xs text-stone-400">
                <div className="rounded-xl bg-[#13100d] border border-[#261f19] p-3.5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-bold text-white uppercase font-['Oswald',sans-serif] tracking-wide">Aberto Hoje</span>
                  </div>
                  <p className="text-stone-300">Terça a Domingo: <strong className="text-amber-400 font-['Oswald',sans-serif]">18:00 às 23:30</strong></p>
                  <p className="text-[11px] text-stone-500">Segunda-feira: Fechado para descanso da equipe</p>
                </div>

                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <Clock size={14} className="text-amber-500 shrink-0" />
                  <span>Tempo médio: <strong className="text-stone-200">30 a 45 min</strong></span>
                </div>
              </div>
            </div>

            {/* Col 3: Pagamento & Gestão */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-orange-500"></div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Oswald',sans-serif]">
                  Pagamento &amp; Acesso
                </h4>
              </div>

              <div className="space-y-2 text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Pix (aprovação instantânea no balcão)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Cartões de Crédito e Débito</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Dinheiro (troco sob solicitação)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#171310] hover:bg-[#201a15] border border-[#382c23] hover:border-orange-500/70 text-stone-200 hover:text-white text-xs font-bold uppercase tracking-wider font-['Oswald',sans-serif] transition-all shadow-md cursor-pointer"
                >
                  <ShieldCheck size={15} className="text-orange-500" />
                  <span>Acesso do Atendente</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={14} className="text-orange-500" />
              <p>© {new Date().getFullYear()} FoodExpress Steakhouse. Todos os direitos reservados.</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-stone-600">
              <span>Cardápio Digital &amp; Sistema de Pedidos</span>
              <span>•</span>
              <span className="text-amber-500/80 font-bold font-['Oswald',sans-serif] uppercase tracking-wider">Sabor da Brasa</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
