import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LogOut, ClipboardList, UtensilsCrossed, ShieldCheck, Clock } from 'lucide-react';

export default function Navbar({ isAdmin = false, cartItemCount = 0, cartCount, onCartClick, onLogout }) {
  const count = cartCount ?? cartItemCount;
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link to={isAdmin ? '/admin/pedidos' : '/'} className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/25 transition-all group-hover:scale-105 group-hover:shadow-orange-500/40">
              <UtensilsCrossed size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-gray-900 leading-none">
                Food<span className="text-orange-500">Express</span>
              </span>
              <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mt-0.5">
                {isAdmin ? 'Painel do Restaurante' : 'Delivery & Salão'}
              </span>
            </div>
          </Link>

          {/* Restaurant Status (Client View Only) */}
          {!isAdmin && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Aberto agora</span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <Clock size={12} /> 30-45 min
              </span>
            </div>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              {/* Admin nav links */}
              <Link
                to="/admin/pedidos"
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                  isActive('/admin/pedidos') || isActive('/admin/orders')
                    ? 'bg-orange-50 text-orange-600 shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Fila de Pedidos"
              >
                <ClipboardList size={18} />
                <span>Pedidos</span>
              </Link>

              <Link
                to="/admin/cardapio"
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                  isActive('/admin/cardapio') || isActive('/admin/menu')
                    ? 'bg-orange-50 text-orange-600 shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Gerenciar Cardápio"
              >
                <UtensilsCrossed size={18} />
                <span>Cardápio</span>
              </Link>

              {/* View Public Menu link */}
              <Link
                to="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                title="Abrir cardápio do cliente em nova aba"
              >
                Ver cardápio público
              </Link>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="ml-2 flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Sair do painel"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline text-xs">Sair</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* Admin Link for staff */}
              <Link
                to="/admin/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                title="Acesso de atendentes e gestão"
              >
                <ShieldCheck size={16} />
                <span>Área do Atendente</span>
              </Link>

              {/* Customer cart button */}
              {onCartClick && (
                <button
                  onClick={onCartClick}
                  className="relative flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  aria-label={`Sacola com ${count} itens`}
                >
                  <ShoppingBag size={18} strokeWidth={2.5} />
                  <span className="hidden xs:inline">Sacola</span>
                  {count > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-black text-orange-600 shadow-xs">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
