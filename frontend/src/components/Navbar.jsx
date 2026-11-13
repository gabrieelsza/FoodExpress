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

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navTabs = [
    { label: 'NOSSOS PRODUTOS', path: '/nossos-produtos', altPaths: ['/delivery', '/cardapio', '/produtos'] },
    { label: 'RESTAURANTE & SALÃO', path: '/restaurante', altPaths: ['/salao'] },
    { label: 'ACESSO DO ATENDENTE', path: '/admin/login', altPaths: [] },
  ];

  const isTabActive = (tab) => {
    if (location.pathname === tab.path) return true;
    if (tab.altPaths && tab.altPaths.includes(location.pathname)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800 shadow-2xl w-full">
      <div className="w-full flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to={isAdmin ? '/admin/pedidos' : '/'} className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black border-2 border-orange-500/50 text-white transition-transform group-hover:scale-105 overflow-hidden shadow-xl ring-2 ring-orange-500/20">
              <img src="/logo.jpg" alt="FoodExpress" className="w-full h-full object-cover scale-105" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white leading-none font-['Oswald',sans-serif]">
                Food<span className="bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent">Express</span>
              </span>
              <span className="text-[10px] font-bold text-amber-500/90 tracking-widest uppercase mt-0.5 font-['Oswald',sans-serif]">
                {isAdmin ? 'Painel Operacional' : 'Steakhouse & Artisan Burgers'}
              </span>
            </div>
          </Link>
        </div>

        {/* Center Search Bar (Client View - when onSearchChange is passed) */}
        {!isAdmin && onSearchChange && (
          <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm mx-2">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="BUSCAR NO CARDÁPIO..."
                className="w-full rounded-full border border-[#2d2520] bg-[#161311] pl-9 pr-9 py-2 text-xs font-semibold text-stone-100 placeholder-stone-500 transition-colors focus:border-orange-500 focus:bg-[#1a1613] focus:outline-none uppercase font-['Oswald',sans-serif] tracking-wider"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-0.5 rounded-full"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Center/Right Outback Style Navigation Tabs (Matches user screenshot) */}
        {!isAdmin && (
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              to="/"
              className={`text-xs font-black uppercase tracking-wider transition-all font-['Oswald',sans-serif] pb-1 border-b-2 ${
                location.pathname === '/'
                  ? 'text-amber-400 border-orange-500 shadow-sm'
                  : 'text-stone-300 hover:text-amber-400 border-transparent'
              }`}
            >
              INÍCIO
            </Link>

            {navTabs.map((tab) => {
              const active = isTabActive(tab);
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`text-xs font-black uppercase tracking-wider transition-all font-['Oswald',sans-serif] pb-1 border-b-2 ${
                    active
                      ? 'text-amber-400 border-orange-500 shadow-sm'
                      : 'text-stone-300 hover:text-amber-400 border-transparent'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? (
            <>
              {/* Admin nav links */}
              <Link
                to="/admin/pedidos"
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider font-['Oswald',sans-serif] transition-colors ${
                  isActive('/admin/pedidos') || isActive('/admin/orders')
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
                title="Fila de Pedidos"
              >
                <ClipboardList size={16} />
                <span>Pedidos</span>
              </Link>

              <Link
                to="/admin/cardapio"
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider font-['Oswald',sans-serif] transition-colors ${
                  isActive('/admin/cardapio') || isActive('/admin/menu')
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
                title="Gerenciar Cardápio"
              >
                <UtensilsCrossed size={16} />
                <span>Cardápio</span>
              </Link>

              {/* View Public Menu link */}
              <Link
                to="/nossos-produtos"
                target="_blank"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider font-['Oswald',sans-serif] text-zinc-400 hover:text-amber-400 rounded-lg transition-colors"
                title="Abrir cardápio do cliente em nova aba"
              >
                Ver cardápio
              </Link>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="ml-1 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider font-['Oswald',sans-serif] text-zinc-400 hover:bg-red-950/40 hover:text-red-400 border border-transparent hover:border-red-900/40 transition-colors cursor-pointer"
                title="Sair do painel"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </>
          ) : (
            /* Customer Cart button with live count and subtotal */
            onCartClick ? (
              <button
                onClick={onCartClick}
                className="relative flex items-center gap-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-4 sm:px-5 py-2 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
                aria-label={`Sacola com ${count} itens`}
              >
                <ShoppingBag size={16} strokeWidth={2.2} className="text-orange-500" />
                <span className="font-bold text-xs sm:text-sm text-white">Sacola</span>
                {count > 0 ? (
                  <div className="flex items-center gap-2 pl-1 border-l border-zinc-800 ml-1">
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1.5 text-xs font-bold text-white shadow-sm">
                      {count}
                    </span>
                    <span className="hidden sm:inline text-xs font-semibold text-orange-400">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-500 font-normal">vazia</span>
                )}
              </button>
            ) : (
              /* If no cart click passed, show a direct button to Nossos Produtos / Cardápio */
              <Link
                to="/nossos-produtos"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-md shadow-black/50 uppercase font-['Oswald',sans-serif] tracking-wider transition-all cursor-pointer"
              >
                <ShoppingBag size={15} />
                <span>Pedir Agora</span>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Mobile Subnav for tabs */}
      {!isAdmin && (
        <div className="md:hidden flex items-center gap-4 overflow-x-auto px-4 py-2 bg-black border-t border-zinc-800 scrollbar-hide text-xs font-bold font-['Oswald',sans-serif]">
          <Link
            to="/"
            className={`whitespace-nowrap pb-0.5 border-b-2 ${
              location.pathname === '/' ? 'text-amber-400 border-orange-500' : 'text-stone-400 border-transparent'
            }`}
          >
            INÍCIO
          </Link>
          {navTabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`whitespace-nowrap pb-0.5 border-b-2 ${
                isTabActive(tab) ? 'text-amber-400 border-orange-500' : 'text-stone-400 border-transparent'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
