import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  Bike,
  UtensilsCrossed,
  Clock,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  ShoppingBag,
  Search,
  SlidersHorizontal,
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
    ctaText: 'PEDIR ESTE COMBO',
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

const CATEGORY_TILES = [
  {
    id: 1,
    title: 'Burgers & Lanches na Brasa',
    shortTitle: 'Lanches',
    badge: 'CORTES NOBRES',
    description: 'Blends de 180g grelhados no fogo, pães brioche tostados na manteiga e queijo cheddar derretido.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop',
    itemCount: '3 opções na brasa',
    accent: 'border-orange-500/50',
  },
  {
    id: 2,
    title: 'Aperitivos & Aussie Fries',
    shortTitle: 'Porções',
    badge: 'PARA DIVIDIR',
    description: 'Batatas com cheddar e bacon, Bloomin\' Onion crocante e nuggets crocantes para petiscar.',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=450&fit=crop',
    itemCount: '3 porções generosas',
    accent: 'border-amber-500/50',
  },
  {
    id: 3,
    title: 'Bebidas & Chopps Gelados',
    shortTitle: 'Bebidas',
    badge: 'CANECAS CONGELADAS',
    description: 'Chopp artesanal trincando, refrigerantes de lata bem gelados e sucos naturais da fruta.',
    imageUrl: 'https://images.unsplash.com/photo-1608270191722-1efcb3be4919?w=600&h=450&fit=crop',
    itemCount: '3 opções refrescantes',
    accent: 'border-emerald-500/50',
  },
  {
    id: 4,
    title: 'Sobremesas & Thunder Brownie',
    shortTitle: 'Sobremesas',
    badge: 'DOCES DA CASA',
    description: 'O famoso Thunder Brownie com calda quente de chocolate e pudim artesanal cremoso.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=450&fit=crop',
    itemCount: '2 sobremesas icônicas',
    accent: 'border-rose-500/50',
  },
];

const SIGNATURE_DISHES = [
  {
    id: 1,
    title: 'X-Burger Artesanal',
    category: 'Lanches na Brasa',
    categoryId: 1,
    description: 'Pão brioche selado na manteiga, blend bovino 180g grelhado no fogo, queijo cheddar duplo, alface, tomate e maionese autoral da casa.',
    price: 28.90,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop',
    badge: 'O Mais Pedido',
    tags: ['Blend 180g', 'Queijo Cheddar', 'Pão Brioche', 'Na Brasa'],
  },
  {
    id: 2,
    title: 'X-Salada Especial',
    category: 'Lanches na Brasa',
    categoryId: 1,
    description: 'Hambúrguer 150g suculento na grelha, queijo derretido, alface americana fresca, tomate maduro, cebola roxa e maionese temperada.',
    price: 22.90,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=450&fit=crop',
    badge: 'Clássico Suculento',
    tags: ['Blend 150g', 'Queijo Prato', 'Salada Fresca'],
  },
  {
    id: 3,
    title: 'Frango Crispy Steakhouse',
    category: 'Lanches na Brasa',
    categoryId: 1,
    description: 'Sobrecoxa de frango empanada com casquinha crocante temperada com páprica defumada, maionese artesanal e alface no pão com gergelim.',
    price: 25.90,
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=450&fit=crop',
    badge: 'Crosta Dourada',
    tags: ['Frango Crocante', 'Pão Gergelim', 'Molho da Casa'],
  },
  {
    id: 4,
    title: 'Aussie Cheese Fries',
    category: 'Porções & Entradas',
    categoryId: 2,
    description: 'Porção generosa de batatas fritas douradas e crocantes cobertas com farta camada de queijo cheddar cremoso e cubos de bacon frito crocante.',
    price: 18.90,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=450&fit=crop',
    badge: 'Favorito da Galera',
    tags: ['Batatas Rústicas', 'Cheddar Quente', 'Bacon Crocante'],
  },
  {
    id: 6,
    title: 'Bloomin\' Onion Rings',
    category: 'Porções & Entradas',
    categoryId: 2,
    description: 'Anéis gigantes de cebola empanados em farinha especial com especiarias secretas, fritos sequinhos e servidos com molho ranch autoral.',
    price: 16.90,
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=450&fit=crop',
    badge: 'Crocância Máxima',
    tags: ['Anéis de Cebola', 'Molho Ranch', 'Empanado Especial'],
  },
  {
    id: 5,
    title: 'Nuggets Crocantes (10 un)',
    category: 'Porções & Entradas',
    categoryId: 2,
    description: '10 unidades de nuggets 100% peito de frango selecionado, crocantes por fora e macios por dentro, com molho barbecue defumado.',
    price: 19.90,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=450&fit=crop',
    badge: 'Porção Família',
    tags: ['100% Peito de Frango', 'Molho Barbecue', '10 Unidades'],
  },
  {
    id: 8,
    title: 'Chopp Artesanal Caneca Congelada',
    category: 'Bebidas & Chopps',
    categoryId: 3,
    description: 'Chopp pilsen artesanal puro malte tirado no padrão perfeito e servido na caneca ultracongelada para máxima refrescância.',
    price: 11.90,
    imageUrl: 'https://images.unsplash.com/photo-1608270191722-1efcb3be4919?w=600&h=450&fit=crop',
    badge: 'Trincando de Gelado',
    tags: ['Puro Malte', 'Caneca Congelada', 'Chopp Artesanal'],
  },
  {
    id: 9,
    title: 'Refrigerante Lata & Sucos',
    category: 'Bebidas & Chopps',
    categoryId: 3,
    description: 'Coca-Cola, Guaraná Antarctica, opções Zero e sucos naturais de laranja e maracujá servidos com copo de gelo e limão.',
    price: 6.90,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=450&fit=crop',
    badge: 'Refrescante',
    tags: ['Lata 350ml', 'Gelo & Limão', 'Opções Zero'],
  },
  {
    id: 11,
    title: 'Thunder Brownie com Sorvete',
    category: 'Sobremesas Especiais',
    categoryId: 4,
    description: 'Brownie morno com textura densa de puro chocolate belga, calda quente cremosa de chocolate meio amargo e bola generosa de sorvete de baunilha.',
    price: 19.90,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=450&fit=crop',
    badge: 'Final Perfeito',
    tags: ['Chocolate Belga', 'Calda Quente', 'Sorvete Baunilha'],
  },
  {
    id: 12,
    title: 'Pudim Artesanal de Leite',
    category: 'Sobremesas Especiais',
    categoryId: 4,
    description: 'Pudim tradicional de leite condensado super aveludado e sem furinhos, banhado em calda dourada brilhante de caramelo.',
    price: 12.90,
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=450&fit=crop',
    badge: 'Receita da Casa',
    tags: ['Leite Condensado', 'Calda de Caramelo', 'Cremoso'],
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cardapio?busca=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/cardapio');
    }
  };

  const handleNavigateToMenu = (categoryId = null) => {
    if (categoryId) {
      navigate(`/cardapio?categoria=${categoryId}`);
    } else {
      navigate('/cardapio');
    }
  };

  const scrollToProducts = () => {
    const el = document.getElementById('nossos-produtos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      handleNavigateToMenu();
    }
  };

  // Filter dishes by active tab
  const filteredDishes = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return SIGNATURE_DISHES;
    return SIGNATURE_DISHES.filter((d) => d.categoryId === activeCategoryFilter);
  }, [activeCategoryFilter]);

  return (
    <div className="min-h-screen bg-[#0b0908] text-stone-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-orange-600 flex flex-col">
      {/* 1. TOP NAVBAR (Outback Tabs: INÍCIO | NOSSOS PRODUTOS | RESTAURANTE & SALÃO | DELIVERY | ACESSO DO ATENDENTE) */}
      <Navbar isAdmin={false} />

      {/* 2. HUGE SPLIT HERO BANNER (Directly Emulating the Outback Screenshot) */}
      <section
        className="relative w-full bg-[#0a0807] overflow-hidden border-b border-[#241d18]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[500px] lg:min-h-[620px]">
          {/* Left Side: High-energy lifestyle steakhouse photography */}
          <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] lg:min-h-full overflow-hidden">
            <img
              src={currentSlide.photoUrl}
              alt={currentSlide.photoAlt}
              className="w-full h-full object-cover object-center transform transition-transform duration-1000 scale-102 hover:scale-105"
            />
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0807] via-transparent to-transparent lg:hidden" />
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0807]" />

            {/* Floating Quality Tag */}
            <div className="absolute top-5 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-amber-400 border border-orange-500/40 text-[10px] sm:text-xs font-black uppercase font-['Oswald',sans-serif] tracking-wider shadow-xl">
                <Flame size={12} className="text-orange-500 fill-orange-500" />
                Steakhouse Experience
              </span>
            </div>
          </div>

          {/* Right Side: Outback Style Graphic Canvas in Dark Mode */}
          <div className="lg:col-span-5 relative flex flex-col justify-center p-6 sm:p-10 lg:p-14 bg-radial from-[#181310] via-[#100d0b] to-[#0a0807] border-l border-[#241d18]/60 text-center lg:text-left">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 space-y-4 sm:space-y-6">
              {/* Eyebrow & Tag */}
              <div className="space-y-1">
                <span className="block text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-500 font-['Oswald',sans-serif]">
                  {currentSlide.badge}
                </span>
                <span className="block text-[10px] sm:text-[11px] font-bold text-stone-400 tracking-wider uppercase">
                  {currentSlide.tag}
                </span>
              </div>

              {/* Big Bold Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase font-['Oswald',sans-serif] leading-[1.08]">
                {currentSlide.title}
              </h1>

              {/* Subtitle / Description */}
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto lg:mx-0 leading-relaxed">
                {currentSlide.subtitle}
              </p>

              {/* Operating / Info Tag */}
              <div className="inline-block px-3 py-1 rounded-lg bg-[#1a1411] border border-[#33261f] text-[11px] font-semibold text-amber-400/90 font-['Oswald',sans-serif] tracking-wider uppercase">
                {currentSlide.schedule}
              </div>

              {/* Big Prominent Outback Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => handleNavigateToMenu()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 active:scale-95 text-white font-black text-sm uppercase tracking-wider font-['Oswald',sans-serif] shadow-xl shadow-orange-950/80 transition-all cursor-pointer"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={scrollToProducts}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#171310] hover:bg-[#201a15] border border-[#382c23] hover:border-orange-500/70 text-stone-300 hover:text-white font-bold text-xs uppercase tracking-wider font-['Oswald',sans-serif] transition-colors cursor-pointer"
                >
                  <span>Explorar Produtos</span>
                </button>
              </div>

              {/* Outback Signature Seal */}
              <div className="pt-4 border-t border-[#241d18] flex items-center justify-center lg:justify-start gap-3 text-stone-500">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black border border-orange-500/40 text-orange-500">
                  <UtensilsCrossed size={13} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400 font-['Oswald',sans-serif]">
                  FOODEXPRESS STEAKHOUSE BRASIL
                </span>
              </div>
            </div>

            {/* Slider Dots Indicator */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-2">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'w-8 bg-gradient-to-r from-red-600 to-amber-500'
                      : 'w-2 bg-[#2d241e] hover:bg-[#4a3b31]'
                  }`}
                  aria-label={`Ir para slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. "NOSSOS PRODUTOS & VIVA O SABOR FOODEXPRESS" — ULTRA REFINED SHOWCASE */}
      <section id="nossos-produtos" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161210] border border-[#33261e] text-xs font-bold text-orange-400 uppercase tracking-widest font-['Oswald',sans-serif]">
            <Flame size={14} className="fill-orange-500" />
            NOSSOS PRODUTOS EXCLUSIVOS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wider font-['Oswald',sans-serif]">
            VIVA O SABOR FOODEXPRESS
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 mx-auto rounded-full mt-3"></div>
          <p className="text-sm sm:text-base text-stone-400 max-w-2xl mx-auto pt-2 leading-relaxed">
            Mergulhe no universo das nossas criações artesanais. Escolha uma categoria para explorar os cortes nobres na brasa viva, porções crocantes, chopps trincando e doces inesquecíveis.
          </p>
        </div>

        {/* 3.1. ICONIC CATEGORY HERO TILES (Outback Style Category Tiles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {CATEGORY_TILES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleNavigateToMenu(cat.id)}
              className="group relative overflow-hidden rounded-2xl bg-[#14110f] border border-[#2b221c] hover:border-orange-500/70 p-6 flex flex-col justify-between min-h-[220px] shadow-xl hover:shadow-2xl hover:shadow-orange-950/40 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Background image preview with dark gradient */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-500">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-[#14110f]/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-950/90 text-amber-300 border border-red-800/60 font-['Oswald',sans-serif]">
                  {cat.badge}
                </span>
                <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors font-['Oswald',sans-serif] uppercase tracking-wide leading-tight">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Tile footer */}
              <div className="relative z-10 pt-4 border-t border-[#231b16] mt-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-400 font-['Oswald',sans-serif]">
                  {cat.itemCount}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-orange-400 uppercase font-['Oswald',sans-serif] tracking-wider">
                  <span>Explorar</span>
                  <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 3.2. INTERACTIVE CATEGORY FILTER TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 pb-4 border-b border-[#221b16]">
          <button
            onClick={() => setActiveCategoryFilter('ALL')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black whitespace-nowrap transition-all uppercase font-['Oswald',sans-serif] tracking-wider cursor-pointer ${
              activeCategoryFilter === 'ALL'
                ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-950/80 border border-orange-400/50'
                : 'bg-[#15110f] text-stone-400 hover:bg-[#1f1915] hover:text-stone-200 border border-[#2b221c]'
            }`}
          >
            <Flame size={14} className={activeCategoryFilter === 'ALL' ? 'text-white' : 'text-orange-500'} />
            <span>Todos os Pratos ({SIGNATURE_DISHES.length})</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter(1)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black whitespace-nowrap transition-all uppercase font-['Oswald',sans-serif] tracking-wider cursor-pointer ${
              activeCategoryFilter === 1
                ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-950/80 border border-orange-400/50'
                : 'bg-[#15110f] text-stone-400 hover:bg-[#1f1915] hover:text-stone-200 border border-[#2b221c]'
            }`}
          >
            <span>Lanches na Brasa (3)</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter(2)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black whitespace-nowrap transition-all uppercase font-['Oswald',sans-serif] tracking-wider cursor-pointer ${
              activeCategoryFilter === 2
                ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-950/80 border border-orange-400/50'
                : 'bg-[#15110f] text-stone-400 hover:bg-[#1f1915] hover:text-stone-200 border border-[#2b221c]'
            }`}
          >
            <span>Porções &amp; Aussie Fries (3)</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter(3)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black whitespace-nowrap transition-all uppercase font-['Oswald',sans-serif] tracking-wider cursor-pointer ${
              activeCategoryFilter === 3
                ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-950/80 border border-orange-400/50'
                : 'bg-[#15110f] text-stone-400 hover:bg-[#1f1915] hover:text-stone-200 border border-[#2b221c]'
            }`}
          >
            <span>Chopps &amp; Bebidas (2)</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter(4)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black whitespace-nowrap transition-all uppercase font-['Oswald',sans-serif] tracking-wider cursor-pointer ${
              activeCategoryFilter === 4
                ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-950/80 border border-orange-400/50'
                : 'bg-[#15110f] text-stone-400 hover:bg-[#1f1915] hover:text-stone-200 border border-[#2b221c]'
            }`}
          >
            <span>Sobremesas (2)</span>
          </button>
        </div>

        {/* 3.3. DYNAMIC PRODUCTS GRID (Rich, appetizing steakhouse cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => handleNavigateToMenu(dish.categoryId)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#14110f] border border-[#2b221c] shadow-xl hover:shadow-2xl hover:shadow-orange-950/40 hover:border-orange-500/60 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              <div>
                {/* Photo with Dark Overlay */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c0a09]">
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

                  <p className="mt-1.5 text-xs text-stone-400 leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>

                  {/* Ingredient / Flavor Tags */}
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

                <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 text-white text-xs font-black font-['Oswald',sans-serif] uppercase tracking-wider shadow-md shadow-orange-950/60 transition-all cursor-pointer">
                  <span>Pedir no Cardápio</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3.4. BOTTOM CTA BANNER: PERSONALIZAÇÃO & CARDÁPIO */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-[#17120e] via-[#1c1612] to-[#17120e] border border-[#33261e] p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest font-['Oswald',sans-serif]">
              <SlidersHorizontal size={14} className="text-orange-500" />
              PERSONALIZAÇÃO COMPLETA DE PEDIDOS
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-wide">
              Monte seu lanche com adicionais extras
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
              Escolha ponto da carne, bacon crocante em dobro, molhos autorais à parte e monte seu combo perfeito com acompanhamentos.
            </p>
          </div>

          <button
            onClick={() => handleNavigateToMenu()}
            className="shrink-0 inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 active:scale-95 text-white font-black text-sm uppercase tracking-wider font-['Oswald',sans-serif] shadow-xl shadow-orange-950/80 transition-all cursor-pointer"
          >
            <UtensilsCrossed size={17} />
            <span>Ver Cardápio Completo &amp; Pedir</span>
            <ArrowRight size={17} />
          </button>
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
                  onClick={() => handleNavigateToMenu()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider font-['Oswald',sans-serif] shadow-lg cursor-pointer"
                >
                  <span>Fazer Pedido no Delivery</span>
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
                  onClick={() => handleNavigateToMenu()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e1814] hover:bg-[#271f1a] border border-[#382b22] text-stone-200 hover:text-white font-bold text-xs uppercase tracking-wider font-['Oswald',sans-serif] transition-colors cursor-pointer"
                >
                  <span>Pedir na Mesa do Salão</span>
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
