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
    <div className="min-h-screen bg-[#0f0f11] text-neutral-100 antialiased flex flex-col justify-between">
      <div>
        {/* Top Navbar with integrated search */}
        <Navbar
          isAdmin={false}
          cartItemCount={cart.totalItems}
          onCartClick={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Restaurant Header Section: Full-Width Cover Banner with Overlapping Avatar */}
        <div className="relative bg-[#141417] border-b border-neutral-800/80">
          {/* Cover Photo Banner (Using custom banner.jpg) */}
          <div className="w-full overflow-hidden relative bg-neutral-950 aspect-[1024/340] max-h-80 sm:max-h-96 shadow-inner">
            <img
              src="/banner.jpg"
              alt="FoodExpress Banner"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Store Info Profile (Avatar overlaps banner, details on dark background) */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 pt-3">
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                {/* Store Avatar Badge (Overlapping bottom-left of the banner) */}
                <div className="-mt-12 sm:-mt-16 relative flex h-20 w-20 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl bg-neutral-950 border-2 border-neutral-800 text-white shadow-2xl ring-4 ring-neutral-900/90 sm:ring-white/20 overflow-hidden z-10">
                  <img
                    src="/logo.jpg"
                    alt="FoodExpress"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Store Info (Cleanly positioned on dark background) */}
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-neutral-200">
                    Hamburgueria Artesanal • Porções • Bebidas &amp; Sobremesas
                  </p>

                  {/* Key Metrics */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
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

                    <span className="inline-flex items-center gap-1 font-medium text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60 text-xs">
                      <Bike size={13} />
                      Salão &amp; Entrega
                    </span>

                    <span className="text-neutral-700">•</span>

                    <span className="inline-flex items-center gap-1.5 font-medium text-neutral-300 text-xs">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
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

        {/* Minimalist Professional Footer */}
        <footer className="mt-20 border-t border-neutral-800/80 bg-[#121215] py-10 pb-28 sm:pb-12 text-neutral-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 text-white overflow-hidden shadow-sm">
                  <img src="/logo.jpg" alt="FoodExpress" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-white text-sm">FoodExpress</span>
                <span className="text-xs text-neutral-400">• Hamburgueria Artesanal</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-400">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="text-neutral-400 hover:text-orange-400 underline transition-colors cursor-pointer"
                >
                  Acesso do Atendente
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800/60 text-center sm:text-left text-[11px] text-neutral-500">
              <p>© {new Date().getFullYear()} FoodExpress. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
