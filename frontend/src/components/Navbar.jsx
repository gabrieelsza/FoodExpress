import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LogOut, ClipboardList, UtensilsCrossed, Search, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/helpers';

export default function Navbar({
  isAdmin = false,
  cartItemCount = 0,
  cartCount,
  onCartClick,
  onLogout,
  searchQuery = '',
  onSearchChange,
}) {
  const count = cartCount ?? cartItemCount;
  const location = useLocation();
  const { totalPrice } = useCart();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-[#0e0c0a]/95 backdrop-blur-md border-b border-[#26201b] shadow-xl w-full">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <Link to={isAdmin ? '/admin/pedidos' : '/'} className="flex items-center gap-3 shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black border border-orange-500/50 text-white transition-transform group-hover:scale-105 overflow-hidden shadow-lg ring-2 ring-orange-500/20">
              <img src="/logo.jpg" alt="FoodExpress" className="w-full h-full object-cover scale-105" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                Food<span className="bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent">Express</span>
              </span>
              <span className="text-[10px] font-bold text-amber-500/90 tracking-widest uppercase mt-0.5 font-['Oswald',sans-serif]">
                {isAdmin ? 'Painel Operacional' : 'Steakhouse & Artisan Burgers'}
              </span>
            </div>
          </Link>

          {!isAdmin && location.pathname !== '/' && (
            <Link
              to="/"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-stone-300 hover:text-amber-400 hover:bg-[#181411] transition-colors font-['Oswald',sans-serif] uppercase tracking-wider border border-transparent hover:border-[#382b22]"
              title="Voltar para a página inicial"
            >
              Início
            </Link>
          )}
        </div>

        {/* Center Search Bar (Client View Only - Desktop) */}
        {!isAdmin && onSearchChange && (
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar lanches na brasa, porções, bebidas..."
                className="w-full rounded-full border border-[#2d2520] bg-[#161311] pl-10 pr-9 py-2 text-sm text-stone-100 placeholder-stone-500 transition-colors focus:border-orange-500 focus:bg-[#1a1613] focus:outline-none shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-0.5 rounded-full"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? (
            <>
              {/* Admin nav links */}
              <Link
                to="/admin/pedidos"
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive('/admin/pedidos') || isActive('/admin/orders')
                    ? 'bg-orange-500 text-white'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
                title="Fila de Pedidos"
              >
                <ClipboardList size={17} />
                <span>Pedidos</span>
              </Link>

              <Link
                to="/admin/cardapio"
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive('/admin/cardapio') || isActive('/admin/menu')
                    ? 'bg-orange-500 text-white'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
                title="Gerenciar Cardápio"
              >
                <UtensilsCrossed size={17} />
                <span>Cardápio</span>
              </Link>

              {/* View Public Menu link */}
              <Link
                to="/"
                target="_blank"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-lg transition-colors"
                title="Abrir cardápio do cliente em nova aba"
              >
                Ver cardápio
              </Link>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="ml-1 flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-400 hover:bg-red-950/40 hover:text-red-400 transition-colors cursor-pointer"
                title="Sair do painel"
              >
                <LogOut size={17} />
                <span className="hidden sm:inline text-xs">Sair</span>
              </button>
            </>
          ) : (
            /* Customer Cart button with live count and subtotal */
            onCartClick && (
              <button
                onClick={onCartClick}
                className="relative flex items-center gap-2.5 rounded-full bg-[#181411] hover:bg-[#201b17] border border-[#3a3029] hover:border-orange-500/50 text-white px-4 sm:px-5 py-2.5 font-bold text-sm shadow-md transition-all hover:shadow-orange-950/30 active:scale-[0.98] cursor-pointer"
                aria-label={`Sacola com ${count} itens`}
              >
                <ShoppingBag size={17} strokeWidth={2.2} className="text-amber-500" />
                <span className="font-bold text-sm text-stone-100">Sacola</span>
                {count > 0 ? (
                  <div className="flex items-center gap-2 pl-1 border-l border-[#3a3029] ml-1">
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-1.5 text-xs font-black text-white shadow-sm">
                      {count}
                    </span>
                    <span className="hidden sm:inline text-xs font-semibold text-amber-400">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-stone-500 font-normal">vazia</span>
                )}
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
