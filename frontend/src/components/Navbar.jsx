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
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.05)] w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand / Logo */}
        <Link to={isAdmin ? '/admin/pedidos' : '/'} className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white transition-transform group-hover:scale-105">
            <UtensilsCrossed size={19} strokeWidth={2.5} className="text-orange-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-neutral-900 leading-none">
              Food<span className="text-orange-600">Express</span>
            </span>
            <span className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase mt-0.5">
              {isAdmin ? 'Painel Operacional' : 'Restaurante & Delivery'}
            </span>
          </div>
        </Link>

        {/* Center Search Bar (Client View Only - Desktop) */}
        {!isAdmin && onSearchChange && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar lanche, porção, bebida..."
                className="w-full rounded-full border border-neutral-200 bg-neutral-50/70 pl-10 pr-9 py-2 text-sm text-neutral-800 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5 rounded-full"
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
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
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
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
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
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 rounded-lg transition-colors"
                title="Abrir cardápio do cliente em nova aba"
              >
                Ver cardápio
              </Link>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="ml-1 flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
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
                className="relative flex items-center gap-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white px-4 sm:px-5 py-2.5 font-bold text-sm shadow-sm transition-all hover:shadow active:scale-[0.98] cursor-pointer"
                aria-label={`Sacola com ${count} itens`}
              >
                <ShoppingBag size={17} strokeWidth={2.2} className="text-orange-400" />
                <span className="font-semibold text-sm">Sacola</span>
                {count > 0 ? (
                  <div className="flex items-center gap-2 pl-1 border-l border-neutral-700 ml-1">
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-bold text-white">
                      {count}
                    </span>
                    <span className="hidden sm:inline text-xs font-medium text-neutral-300">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400 font-normal">vazia</span>
                )}
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
