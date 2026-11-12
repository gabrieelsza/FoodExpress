import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Refs for category sections (scroll-into-view)
  const sectionRefs = useRef({});
  const tabsBarRef = useRef(null);

  // Active categories from mock data
  const categories = useMemo(
    () =>
      MOCK_MENU.categories
        .filter((c) => c.active)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    []
  );

  // Set default selected category
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // ---- Intersection Observer to update active tab on scroll ----
  useEffect(() => {
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
        { threshold, rootMargin: '-80px 0px -60% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

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
    const section = sectionRefs.current[catId];
    if (section) {
      const yOffset = -120; // account for sticky navbar + tabs
      const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const handleModalAdd = useCallback(
    (product, variation, addons, notes, quantity) => {
      cart.addItem(product, variation, addons, notes, quantity);
      setSelectedProduct(null);
    },
    [cart]
  );

  const handleCheckout = useCallback(
    (orderType, tableNumber, customerName, deliveryAddress) => {
      // Build items structure matching order schema
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
        // Generate WhatsApp message and open in new tab
        const message = generateWhatsAppMessage(newOrder);
        const whatsAppUrl = generateWhatsAppUrl(RESTAURANT_CONFIG.whatsappNumber, message);
        window.open(whatsAppUrl, '_blank');
      }

      // Navigate to order tracking
      navigate(`/pedido/${newOrder.id}`);
    },
    [cart, orders, navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Navbar */}
      <Navbar
        isAdmin={false}
        cartCount={cart.totalItems}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Sticky Category Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div
          ref={tabsBarRef}
          className="flex overflow-x-auto scrollbar-hide px-4 gap-1"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              data-active={selectedCategory === cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative
                ${
                  selectedCategory === cat.id
                    ? 'text-orange-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {cat.name}
              {selectedCategory === cat.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Sections */}
      <div className="px-4 pt-4">
        {categories.map((cat) => {
          const activeProducts = cat.products.filter((p) => p.active);
          if (activeProducts.length === 0) return null;

          return (
            <section
              key={cat.id}
              ref={(el) => {
                sectionRefs.current[cat.id] = el;
              }}
              className="mb-8"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-3">{cat.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={handleModalAdd}
        />
      )}

      {/* Floating Cart Bar */}
      {cart.totalItems > 0 && (
        <FloatingCartBar
          totalItems={cart.totalItems}
          totalPrice={cart.totalPrice}
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
