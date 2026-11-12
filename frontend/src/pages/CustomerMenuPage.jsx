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
    <div className="min-h-screen bg-[#0f0f11] text-neutral-100 antialiased flex flex-col">
      <div className="flex-1">
        {/* Top Navbar with integrated search */}
        <Navbar
          isAdmin={false}
          cartItemCount={cart.totalItems}
          onCartClick={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Restaurant Header Profile Section (No Banner) */}
        <div className="relative bg-[#141417] border-b border-neutral-800/80 py-6 sm:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Store Avatar Badge */}
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-black border-2 border-neutral-800 text-white shadow-xl ring-2 ring-orange-500/50 overflow-hidden">
                  <img
                    src="/logo.jpg"
                    alt="FoodExpress"
                    className="w-full h-full object-cover scale-105"
                  />
                </div>

                {/* Store Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                      FoodExpress
                    </h1>
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-500/20 text-orange-400">
                      <CheckCircle2 size={15} className="text-orange-500" />
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-neutral-400 mt-0.5">
                    Hamburgueria Artesanal • Porções • Bebidas &amp; Sobremesas
                  </p>

                  {/* Key Metrics */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1 font-bold text-white">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      4.9
                      <span className="font-normal text-neutral-400">(500+ avaliações)</span>
                    </span>

                    <span className="text-neutral-700">•</span>

                    <span className="inline-flex items-center gap-1 font-medium text-neutral-300">
                      <Clock size={14} className="text-neutral-400" />
                      30–45 min
                    </span>

                    <span className="text-neutral-700">•</span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                      <Bike size={13} />
                      Salão &amp; Entrega
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Aberto hoje até 23:30
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Search Input */}
              <div className="sm:hidden w-full">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar no cardápio..."
                    className="w-full rounded-full border border-neutral-700/80 bg-neutral-900/90 pl-9 pr-9 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
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
          <div className="sticky top-16 z-30 bg-[#141417]/95 backdrop-blur-md border-b border-neutral-800/80 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
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
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 border border-orange-400/30'
                          : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                          isSelected ? 'bg-orange-700/70 text-white' : 'bg-neutral-800 text-neutral-400'
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
                <h2 className="text-xl font-bold text-white">
                  Resultados para "{searchQuery}"
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {filteredProductsBySearch.length} item(ns) encontrado(s)
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-orange-400 hover:underline cursor-pointer"
              >
                Limpar busca
              </button>
            </div>

            {filteredProductsBySearch.length === 0 ? (
              <div className="py-16 text-center bg-[#18181c] rounded-2xl border border-neutral-800 p-8 shadow-xs">
                <Search size={36} className="mx-auto text-neutral-600 mb-2.5" />
                <h3 className="text-sm font-bold text-neutral-200">Nenhum item encontrado</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  Tente buscar por outro termo ou navegue pelas categorias.
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
          <div className="space-y-10">
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
                  <div className="flex items-baseline justify-between border-b border-neutral-800/80 pb-2.5 mb-5">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {cat.name}
                    </h2>
                    <span className="text-xs font-medium text-neutral-400">
                      {activeProducts.length} {activeProducts.length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>

                  {/* Products Grid: 4 columns on large screens! */}
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

      {/* Modern, High-End Artisan Restaurant Footer */}
      <footer className="mt-16 border-t border-neutral-800/80 bg-[#121215] text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-800/70">
            {/* Col 1: Brand Info & Quality Badges */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black border border-orange-500/40 text-white overflow-hidden shadow-md ring-2 ring-orange-500/20">
                  <img src="/logo.jpg" alt="FoodExpress" className="w-full h-full object-cover scale-105" />
                </div>
                <div>
                  <span className="text-xl font-extrabold text-white tracking-tight leading-none block">
                    Food<span className="text-orange-500">Express</span>
                  </span>
                  <span className="text-xs font-medium text-neutral-400">Hamburgueria Artesanal & Delivery</span>
                </div>
              </div>
              <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
                Hambúrgueres artesanais preparados com blends nobres grelhados no fogo, molhos especiais e ingredientes frescos selecionados. O verdadeiro sabor da brasa direto na sua mesa ou entregue com rapidez na sua casa.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-neutral-300">
                  <CheckCircle2 size={12} className="text-orange-500" /> Carnes Nobres
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-neutral-300">
                  <Bike size={12} className="text-orange-500" /> Entrega Express
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-neutral-300">
                  <Clock size={12} className="text-orange-500" /> Preparo Artesanal
                </span>
              </div>
            </div>

            {/* Col 2: Horário & Atendimento */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">Atendimento & Horários</h4>
              <ul className="space-y-3 text-xs text-neutral-400">
                <li className="flex items-start gap-2.5">
                  <Clock size={15} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-neutral-200 block">Terça a Domingo</span>
                    <span>18:00 às 23:30</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <UtensilsCrossed size={15} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-neutral-200 block">Salão & Delivery</span>
                    <span>Pedidos no balcão e entrega rápida</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Col 3: Pagamento & Área de Atendente */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">Pagamento & Gestão</h4>
              <div className="space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Pix (aprovação instantânea)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Cartões de Débito e Crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Dinheiro (troco sob solicitação)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-orange-500/50 text-neutral-200 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <ShieldCheck size={14} className="text-orange-500" />
                  Painel do Atendente
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
            <p>© {new Date().getFullYear()} FoodExpress Hamburgueria Artesanal. Todos os direitos reservados.</p>
            <p className="text-[11px] text-neutral-400">Cardápio Digital & Sistema Operacional Integrado</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
