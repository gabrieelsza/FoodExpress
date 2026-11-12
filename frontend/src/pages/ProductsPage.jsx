import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Flame,
  Sparkles,
  Bike,
  UtensilsCrossed,
  Clock,
  Star,
  SlidersHorizontal,
  X,
  ArrowRight,
  ShieldCheck,
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

const CATEGORY_TILES = [
  {
    id: 1,
    title: 'Burgers & Lanches na Brasa',
    badge: 'CORTES NOBRES',
    description: 'Blends de 180g selados no fogo com queijo cheddar fundido e pão brioche.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop',
    itemCount: '3 opções na brasa',
  },
  {
    id: 2,
    title: 'Aperitivos & Aussie Fries',
    badge: 'PARA DIVIDIR',
    description: 'Batatas com cheddar e bacon, Bloomin\' Onion crocante e nuggets suculentos.',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=450&fit=crop',
    itemCount: '3 porções generosas',
  },
  {
    id: 3,
    title: 'Bebidas & Chopps Gelados',
    badge: 'CANECAS CONGELADAS',
    description: 'Chopp artesanal trincando, refrigerantes em lata e sucos naturais da fruta.',
    imageUrl: 'https://images.unsplash.com/photo-1608270191722-1efcb3be4919?w=600&h=450&fit=crop',
    itemCount: '3 opções refrescantes',
  },
  {
    id: 4,
    title: 'Sobremesas & Thunder Brownie',
    badge: 'DOCES DA CASA',
    description: 'O clássico Thunder Brownie quente de chocolate belga com sorvete artesanal.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=450&fit=crop',
    itemCount: '2 sobremesas icônicas',
  },
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const cart = useCart();
  const orders = useOrders();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Menu data from localStorage or fallback
  const menuData = useMemo(() => {
    try {
      const saved = localStorage.getItem('foodexpress_admin_menu_data');
      return saved ? JSON.parse(saved) : MOCK_MENU;
    } catch {
      return MOCK_MENU;
    }
  }, []);

  const categories = useMemo(
    () =>
      (menuData.categories || [])
        .filter((c) => c.active)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [menuData]
  );

  // All active products flat
  const allProducts = useMemo(() => {
    const list = [];
    categories.forEach((cat) => {
      (cat.products || []).forEach((prod) => {
        if (prod.active) {
          list.push({ ...prod, categoryName: cat.name, categoryId: cat.id });
        }
      });
    });
    return list;
  }, [categories]);

  // Filtered products by category and search
  const filteredProducts = useMemo(() => {
    let prods = allProducts;
    if (selectedCategory !== 'ALL') {
      prods = prods.filter((p) => p.categoryId === selectedCategory);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      prods = prods.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return prods;
  }, [allProducts, selectedCategory, searchQuery]);

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
      const orderType = checkoutData?.orderType || 'DELIVERY';
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
        const whatsAppUrl = generateWhatsAppUrl(RESTAURANTE_CONFIG?.whatsappNumber || '5511999999999', message);
        window.open(whatsAppUrl, '_blank');
      }

      navigate(`/pedido/${newOrder.id}`);
    },
    [cart, orders, navigate]
  );

  return (
    <div className="min-h-screen bg-[#0b0908] text-stone-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-orange-600 flex flex-col">
      {/* 1. Global Navbar with "NOSSOS PRODUTOS" active */}
      <Navbar
        isAdmin={false}
        cartItemCount={cart.totalItems}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Page Hero Banner Header */}
      <div className="relative bg-[#100e0c] border-b border-[#241d18] py-10 sm:py-14 steakhouse-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181310] border border-[#33261f] text-xs font-bold text-orange-400 uppercase tracking-widest font-['Oswald',sans-serif]">
                <Flame size={14} className="fill-orange-500" />
                CARDÁPIO OFICIAL FOODEXPRESS
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider font-['Oswald',sans-serif]">
                Nossos Produtos
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl leading-relaxed">
                Explore todos os pratos lendários do nosso cardápio. Blends grelhados na brasa, queijos derretidos, batatas crocantes e sobremesas generosas.
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2 text-xs text-stone-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Cozinha Aberta até 23:30
              </span>
              <span className="text-stone-500">Entrega rápida em 30 a 45 minutos</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Tiles Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
          {CATEGORY_TILES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group relative overflow-hidden rounded-2xl bg-[#14110f] border p-5 flex flex-col justify-between min-h-[190px] shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 shadow-orange-950/50 ring-2 ring-orange-500/30'
                    : 'border-[#2b221c] hover:border-orange-500/60'
                }`}
              >
                <div className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity">
                  <img src={cat.imageUrl} alt={cat.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-[#14110f]/80 to-transparent" />
                </div>

                <div className="relative z-10 space-y-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-950/90 text-amber-300 border border-red-800/60 font-['Oswald',sans-serif]">
                    {cat.badge}
                  </span>
                  <h3 className="text-lg font-black text-white font-['Oswald',sans-serif] uppercase tracking-wide leading-tight group-hover:text-amber-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="relative z-10 pt-3 border-t border-[#231b16] mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-stone-400 font-['Oswald',sans-serif]">
                    {cat.itemCount}
                  </span>
                  <span className="text-xs font-bold text-amber-400 uppercase font-['Oswald',sans-serif]">
                    {isSelected ? 'Selecionado ✓' : 'Ver Itens →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Interactive Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#221b16] scrollbar-hide">
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-black whitespace-nowrap transition-all uppercase font-['Oswald',sans-serif] tracking-wider cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-950/80 border border-orange-400/50'
                : 'bg-[#15110f] text-stone-400 hover:bg-[#1f1915] hover:text-stone-200 border border-[#2b221c]'
            }`}
          >
            <Flame size={14} className={selectedCategory === 'ALL' ? 'text-white' : 'text-orange-500'} />
            <span>Todos os Pratos ({allProducts.length})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = (cat.products || []).filter((p) => p.active).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-black whitespace-nowrap transition-all uppercase font-['Oswald',sans-serif] tracking-wider cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-950/80 border border-orange-400/50'
                    : 'bg-[#15110f] text-stone-400 hover:bg-[#1f1915] hover:text-stone-200 border border-[#2b221c]'
                }`}
              >
                <span>{cat.name} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* 5. Products Grid */}
        <main className="pb-16 flex-1">
          {searchQuery && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-stone-400">
                Mostrando resultados para: <strong className="text-white">"{searchQuery}"</strong> ({filteredProducts.length} itens encontrados)
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-amber-400 hover:underline uppercase font-['Oswald',sans-serif]"
              >
                Limpar Busca
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-[#14110f] rounded-2xl border border-[#29211b] p-8 shadow-md">
              <Search size={36} className="mx-auto text-stone-600 mb-2.5" />
              <h3 className="text-sm font-bold text-stone-200 font-['Oswald',sans-serif] uppercase tracking-wide">
                Nenhum produto encontrado
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                Tente buscar por outro termo ou selecione uma categoria acima.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={() => handleProductClick(product)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

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

      {/* Outback Steakhouse Dark Footer */}
      <footer className="w-full bg-[#090807] border-t border-[#241d18] text-stone-300 relative overflow-hidden mt-auto">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1f1915]">
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
                  <p className="text-[11px] text-stone-500">Segunda-feira: Fechado para descanso</p>
                </div>

                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <Clock size={14} className="text-amber-500 shrink-0" />
                  <span>Tempo médio: <strong className="text-stone-200">30 a 45 min</strong></span>
                </div>
              </div>
            </div>

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
                  <span>Pix (aprovação instantânea)</span>
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
