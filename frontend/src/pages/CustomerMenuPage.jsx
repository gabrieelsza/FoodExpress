import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  Clock,
  Bike,
  Utensils,
  Sparkles,
  Flame,
  Coffee,
  Cake,
  UtensilsCrossed,
  X,
  MapPin,
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

function getCategoryIcon(catName) {
  const lower = catName.toLowerCase();
  if (lower.includes('lanche') || lower.includes('burger')) return UtensilsCrossed;
  if (lower.includes('porç') || lower.includes('batata') || lower.includes('petisco')) return Flame;
  if (lower.includes('bebid') || lower.includes('suco') || lower.includes('refri')) return Coffee;
  if (lower.includes('sobremesa') || lower.includes('doce')) return Cake;
  return Sparkles;
}

export default function CustomerMenuPage() {
  const navigate = useNavigate();
  const cart = useCart();
  const orders = useOrders();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for category sections (scroll-into-view)
  const sectionRefs = useRef({});
  const tabsBarRef = useRef(null);

  // Menu data (stored in localStorage by Admin or fallback to MOCK_MENU)
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

  // ---- Intersection Observer to update active tab on scroll ----
  useEffect(() => {
    if (searchQuery.trim()) return; // disable during active search
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
        { threshold, rootMargin: '-100px 0px -50% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories, searchQuery]);

  // ---- Scroll active tab into view within the tabs bar ----
  useEffect(() => {
    if (!tabsBarRef.current) return;
    const activeBtn = tabsBarRef.current.querySelector('[data-active="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedCategory]);

  // ---- Handlers ----
  const handleCategoryClick = useCallback((catId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
    const section = sectionRefs.current[catId];
    if (section) {
      const yOffset = -140; // account for sticky navbar + tabs
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

  // Search filtering
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
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 pb-28 antialiased">
      {/* Navbar */}
      <Navbar
        isAdmin={false}
        cartItemCount={cart.totalItems}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-b from-orange-50/70 via-amber-50/30 to-transparent border-b border-gray-100/60 pt-6 pb-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Restaurant Profile Card */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/25 border-4 border-white">
                <UtensilsCrossed size={40} strokeWidth={2.2} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                    FoodExpress
                  </h1>
                  <CheckCircle2 size={18} className="text-orange-500 fill-orange-100" />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                  Lanches Artesanais • Porções Crocantes • Bebidas & Sobremesas
                </p>

                {/* Badges / Metrics */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-1 font-bold text-amber-700">
                    <Star size={13} className="fill-amber-500 text-amber-500" />
                    4.9 (500+)
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200/60 px-2.5 py-1 font-medium text-gray-600 shadow-xs">
                    <Clock size={13} className="text-orange-500" />
                    30 - 45 min
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 font-semibold text-emerald-700">
                    <Bike size={13} />
                    Entrega & Salão
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Search Input */}
            <div className="w-full md:max-w-xs">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar no cardápio..."
                  className="w-full rounded-2xl border border-gray-200/80 bg-white pl-10 pr-9 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 shadow-xs transition-all focus:border-orange-500 focus:outline-none focus:ring-3 focus:ring-orange-500/15"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Category Tabs Bar */}
      {!filteredProductsBySearch && (
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div
              ref={tabsBarRef}
              className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide"
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const IconComponent = getCategoryIcon(cat.name);
                const activeCount = (cat.products || []).filter((p) => p.active).length;

                return (
                  <button
                    key={cat.id}
                    data-active={isSelected}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`group flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent
                      size={16}
                      className={isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
                    />
                    <span>{cat.name}</span>
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-500'
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

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search Results Mode */}
        {filteredProductsBySearch ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Resultados para "{searchQuery}"
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {filteredProductsBySearch.length} item(ns) encontrado(s)
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-orange-600 hover:underline"
              >
                Limpar busca
              </button>
            </div>

            {filteredProductsBySearch.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
                <Search size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-base font-bold text-gray-800">Nenhum item encontrado</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Tente buscar por outro ingrediente ou nome (ex: burger, batata, suco).
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
          /* Normal Categories Sections */
          <div className="space-y-12">
            {categories.map((cat) => {
              const activeProducts = (cat.products || []).filter((p) => p.active);
              if (activeProducts.length === 0) return null;
              const IconComponent = getCategoryIcon(cat.name);

              return (
                <section
                  key={cat.id}
                  ref={(el) => {
                    sectionRefs.current[cat.id] = el;
                  }}
                  className="scroll-mt-36"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                          {cat.name}
                        </h2>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">
                      {activeProducts.length} {activeProducts.length === 1 ? 'opção' : 'opções'}
                    </span>
                  </div>

                  {/* Products Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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

      {/* Floating Bottom Cart Bar (Visible when cart has items) */}
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
  );
}
