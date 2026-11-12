import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  Clock,
  Bike,
  UtensilsCrossed,
  X,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { MOCK_MENU, RESTAURANT_CONFIG } from '../data/mockData';
import { formatPrice, generateWhatsAppMessage, generateWhatsAppUrl } from '../utils/helpers';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartDrawer from '../components/CartDrawer';
import FloatingCartBar from '../components/FloatingCartBar';
import PromoCarousel from '../components/PromoCarousel';

export default function CustomerMenuPage() {
  const navigate = useNavigate();
  const cart = useCart();
  const orders = useOrders();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sectionRefs = useRef({});
  const tabsBarRef = useRef(null);

  // Menu data from localStorage or MOCK_MENU
  const menuData = useMemo(() => {
    try {
      const saved = localStorage.getItem('foodexpress_admin_menu_data');
      return saved ? JSON.parse(saved) : MOCK_MENU;
    } catch {
      return MOCK_MENU;
    }
  }, []);

  // Active categories
  const categories = useMemo(
    () =>
      (menuData.categories || [])
        .filter((c) => c.active)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [menuData]
  );

  // Set default selected category
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Observer for active category on scroll
  useEffect(() => {
    if (searchQuery.trim()) return;
    const observers = [];
    const threshold = 0.3;

    categories.forEach((cat) => {
      const el = sectionRefs.current[cat.id];
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setSelectedCategory(cat.id);
            }
          });
        },
        { threshold, rootMargin: '-90px 0px -50% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories, searchQuery]);

  // Scroll active tab into view
  useEffect(() => {
    if (!tabsBarRef.current) return;
    const activeBtn = tabsBarRef.current.querySelector('[data-active="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedCategory]);

  const handleCategoryClick = useCallback((catId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
    const section = sectionRefs.current[catId];
    if (section) {
      const yOffset = -130;
      const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const handlePromoAction = useCallback((slide) => {
    if (slide.productId) {
      let foundProduct = null;
      for (const cat of categories) {
        const prod = (cat.products || []).find((p) => p.id === slide.productId && p.active);
        if (prod) {
          foundProduct = prod;
          break;
        }
      }
      if (foundProduct) {
        setSelectedProduct(foundProduct);
        return;
      }
    }
    if (slide.categoryId) {
      handleCategoryClick(slide.categoryId);
    } else if (categories.length > 0) {
      handleCategoryClick(categories[0].id);
    }
  }, [categories, handleCategoryClick]);

  const handleModalAdd = useCallback(
    (itemData) => {
      if (itemData && itemData.product) {
        cart.addItem(itemData.product, itemData.variation, itemData.addons, itemData.notes, itemData.quantity);
      } else {
        cart.addItem(itemData);
      }
      setSelectedProduct(null);
    },
    [cart]
  );

  const handleCheckout = useCallback(
    (checkoutData) => {
      const orderType = checkoutData?.orderType || 'DINE_IN';
      const tableNumber = checkoutData?.tableNumber || null;
      const customerName = checkoutData?.customerName || null;
      const deliveryAddress = checkoutData?.deliveryAddress || null;

      const orderItems = cart.items.map((item, idx) => ({
        id: idx + 1,
        productNameSnapshot: item.productName,
        quantity: item.quantity,
        variationNameSnapshot: item.variationName,
        addonsJsonSnapshot: JSON.stringify(item.addonsDetail || []),
        notes: item.notes || '',
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
      }));

      const orderData = {
        orderType,
        tableNumber: orderType === 'DINE_IN' ? tableNumber : null,
        customerName: orderType === 'DELIVERY' ? customerName : null,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : null,
        totalAmount: cart.totalPrice,
        items: orderItems,
      };

      const newOrder = orders.createOrder(orderData);
      cart.clearCart();
      setIsCartOpen(false);

      if (orderType === 'DELIVERY') {
        const message = generateWhatsAppMessage(newOrder);
        const whatsAppUrl = generateWhatsAppUrl(RESTAURANT_CONFIG.whatsappNumber, message);
        window.open(whatsAppUrl, '_blank');
      }

      navigate(`/pedido/${newOrder.id}`);
    },
    [cart, orders, navigate]
  );

  // Search filter
  const filteredProductsBySearch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const all = [];
    categories.forEach((cat) => {
      (cat.products || []).forEach((prod) => {
        if (!prod.active) return;
        if (
          prod.name.toLowerCase().includes(q) ||
          (prod.description && prod.description.toLowerCase().includes(q))
        ) {
          all.push({ ...prod, categoryName: cat.name });
        }
      });
    });
    return all;
  }, [categories, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0b0908] text-stone-100 antialiased flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex-1">
        {/* Top Navbar with integrated search */}
        <Navbar
          isAdmin={false}
          cartItemCount={cart.totalItems}
          onCartClick={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Hero Cover Promotional Carousel (At the top in place of static banner) */}
        {!searchQuery && (
          <div className="w-full bg-[#0c0a09] border-b border-[#241d18]">
            <PromoCarousel onActionClick={handlePromoAction} />
          </div>
        )}

        {/* Restaurant Header Profile Section */}
        <div className="relative bg-[#100e0c] border-b border-[#241d18] py-6 sm:py-8 steakhouse-glow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Store Avatar Badge */}
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-black border-2 border-orange-500/50 text-white shadow-2xl ring-4 ring-orange-500/20 overflow-hidden">
                  <img
                    src="/logo.jpg"
                    alt="FoodExpress"
                    className="w-full h-full object-cover scale-105"
                  />
                </div>

                {/* Store Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight font-['Oswald',sans-serif]">
                      FoodExpress
                    </h1>
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-500/20 text-orange-400" title="Restaurante Verificado">
                      <CheckCircle2 size={16} className="text-orange-500" />
                    </span>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-950/80 text-amber-400 border border-red-800/60 font-['Oswald',sans-serif]">
                      Steakhouse
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-stone-400 mt-0.5">
                    Hamburgueria Artesanal • Porções • Bebidas &amp; Sobremesas
                  </p>

                  {/* Key Metrics */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1 font-bold text-white">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      4.9
                      <span className="font-normal text-stone-400">(500+ avaliações)</span>
                    </span>

                    <span className="text-stone-700">•</span>

                    <span className="inline-flex items-center gap-1 font-medium text-stone-300">
                      <Clock size={14} className="text-amber-500" />
                      30–45 min
                    </span>

                    <span className="text-stone-700">•</span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                      <Bike size={13} />
                      Salão &amp; Entrega
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#181411] border border-[#2e251f] text-stone-300 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Aberto hoje até 23:30
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Search Input */}
              <div className="sm:hidden w-full">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar lanches, porções, bebidas..."
                    className="w-full rounded-full border border-[#2e251f] bg-[#14110e] pl-9 pr-9 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-orange-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Category Tabs Bar */}
        {!filteredProductsBySearch && (
          <div className="sticky top-16 z-30 bg-[#0e0c0a]/95 backdrop-blur-md border-b border-[#26201b] shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div
                ref={tabsBarRef}
                className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide"
              >
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const activeCount = (cat.products || []).filter((p) => p.active).length;

                  return (
                    <button
                      key={cat.id}
                      data-active={isSelected}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 cursor-pointer uppercase font-['Oswald',sans-serif] tracking-wider ${
                        isSelected
                          ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-950/70 border border-orange-400/50'
                          : 'bg-[#161210] text-stone-400 hover:bg-[#1e1915] hover:text-stone-200 border border-[#2b231d]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${
                          isSelected ? 'bg-red-950/70 text-amber-200 border border-red-800/50' : 'bg-[#221c17] text-stone-400'
                        }`}
                      >
                        {activeCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Products Grid */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex-1">
        {/* Search Results Mode */}
        {filteredProductsBySearch ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Oswald',sans-serif] uppercase tracking-wide">
                  Resultados para "{searchQuery}"
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  {filteredProductsBySearch.length} item(ns) encontrado(s)
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-amber-400 hover:underline cursor-pointer uppercase font-['Oswald',sans-serif] tracking-wider"
              >
                Limpar busca
              </button>
            </div>

            {filteredProductsBySearch.length === 0 ? (
              <div className="py-16 text-center bg-[#14110f] rounded-2xl border border-[#29211b] p-8 shadow-md">
                <Search size={36} className="mx-auto text-stone-600 mb-2.5" />
                <h3 className="text-sm font-bold text-stone-200 font-['Oswald',sans-serif] uppercase tracking-wide">Nenhum item encontrado</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  Tente buscar por outro corte ou navegue pelas categorias acima.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredProductsBySearch.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={() => handleProductClick(product)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Categories Sections */
          <div className="space-y-12">
            {categories.map((cat) => {
              const activeProducts = (cat.products || []).filter((p) => p.active);
              if (activeProducts.length === 0) return null;

              return (
                <section
                  key={cat.id}
                  ref={(el) => {
                    sectionRefs.current[cat.id] = el;
                  }}
                  className="scroll-mt-32"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-[#26201b] pb-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-1 rounded-full bg-gradient-to-b from-red-600 via-orange-500 to-amber-400"></div>
                      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-['Oswald',sans-serif]">
                        {cat.name}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold text-stone-400 font-['Oswald',sans-serif] tracking-wider uppercase">
                      {activeProducts.length} {activeProducts.length === 1 ? 'opção' : 'opções'}
                    </span>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {activeProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAdd={() => handleProductClick(product)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Product Customization Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={handleModalAdd}
        />
      )}

      {/* Floating Bottom Cart Bar */}
      {cart.totalItems > 0 && (
        <FloatingCartBar
          itemCount={cart.totalItems}
          total={cart.totalPrice}
          onClick={() => setIsCartOpen(true)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      </div>

      {/* Minimalist, Clean Outback-Style Dark Footer (Matching Image 3) */}
      <footer className="mt-16 w-full bg-[#0b0908] border-t border-[#26201b] py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#161210] border border-[#332720] text-orange-500 shadow-md">
                <UtensilsCrossed size={17} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">FoodExpress</span>
                <span className="text-stone-600">•</span>
                <span className="text-xs font-medium text-stone-400">Sistema de Pedidos</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/login')}
              className="text-xs font-semibold text-stone-400 hover:text-orange-400 underline underline-offset-4 transition-colors cursor-pointer"
            >
              Acesso do Atendente
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-[#1c1814] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} FoodExpress. Todos os direitos reservados.</p>
            <p className="text-[11px] text-stone-600">Steakhouse &amp; Hambúrgueres Artesanais na Brasa</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
