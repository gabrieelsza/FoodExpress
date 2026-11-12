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
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 pb-28 antialiased">
      {/* Top Navbar with integrated search */}
      <Navbar
        isAdmin={false}
        cartItemCount={cart.totalItems}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Restaurant Header Section (Real Food Photography Banner) */}
      <div className="relative bg-white border-b border-neutral-200/80">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 lg:h-64 w-full overflow-hidden relative bg-neutral-800">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&h=600&fit=crop&q=80"
            alt="FoodExpress Banner"
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Store Info Profile (Overlapping) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 pb-6">
            <div className="flex items-end gap-4 sm:gap-5">
              {/* Store Avatar Badge */}
              <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-lg ring-4 ring-white overflow-hidden">
                <UtensilsCrossed size={42} strokeWidth={2.2} className="text-orange-500" />
              </div>

              {/* Store Titles */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                    FoodExpress
                  </h1>
                  <CheckCircle2 size={18} className="text-orange-500" />
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
                  Hamburgueria Artesanal • Porções • Bebidas & Sobremesas
                </p>

                {/* Key Metrics */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-neutral-900">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    4.9
                    <span className="font-normal text-neutral-400">(500+ avaliações)</span>
                  </span>

                  <span className="text-neutral-300">•</span>

                  <span className="inline-flex items-center gap-1 font-medium text-neutral-600">
                    <Clock size={13} className="text-neutral-400" />
                    30-45 min
                  </span>

                  <span className="text-neutral-300">•</span>

                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                    <Bike size={13} />
                    Salão & Entrega
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Search Input */}
            <div className="sm:hidden w-full mt-2">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar no cardápio..."
                  className="w-full rounded-full border border-neutral-200 bg-neutral-50 pl-9 pr-9 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
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
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
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
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        isSelected ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-200 text-neutral-600'
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
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search Results Mode */}
        {filteredProductsBySearch ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Resultados para "{searchQuery}"
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {filteredProductsBySearch.length} item(ns) encontrado(s)
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
              >
                Limpar busca
              </button>
            </div>

            {filteredProductsBySearch.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-8 shadow-xs">
                <Search size={36} className="mx-auto text-neutral-300 mb-2.5" />
                <h3 className="text-sm font-bold text-neutral-800">Nenhum item encontrado</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
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
                  <div className="flex items-baseline justify-between border-b border-neutral-200/80 pb-2.5 mb-5">
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
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
      <footer className="mt-20 border-t border-neutral-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white">
                <UtensilsCrossed size={16} strokeWidth={2.5} className="text-orange-500" />
              </div>
              <span className="font-bold text-neutral-900 text-sm">FoodExpress</span>
              <span className="text-xs text-neutral-400">• Sistema de Pedidos</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <button
                onClick={() => navigate('/admin/login')}
                className="text-neutral-500 hover:text-neutral-900 underline transition-colors cursor-pointer"
              >
                Acesso do Atendente
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 text-center sm:text-left text-[11px] text-neutral-400">
            <p>© {new Date().getFullYear()} FoodExpress. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
