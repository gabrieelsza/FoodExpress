import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LogOut, ClipboardList, UtensilsCrossed } from 'lucide-react';

export default function Navbar({ isAdmin = false, cartItemCount = 0, cartCount, onCartClick, onLogout }) {
  const count = cartCount ?? cartItemCount;
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        {/* Logo */}
        <Link to={isAdmin ? '/admin/pedidos' : '/'} className="flex items-center gap-2">
          <span className="text-xl font-bold text-orange-500">🍔 FoodExpress</span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {isAdmin ? (
            <>
              {/* Admin nav links */}
              <Link
                to="/admin/pedidos"
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/admin/pedidos') || isActive('/admin/orders')
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title="Pedidos"
              >
                <ClipboardList size={20} />
                <span className="ml-1.5 hidden sm:inline">Pedidos</span>
              </Link>

              <Link
                to="/admin/cardapio"
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/admin/cardapio') || isActive('/admin/menu')
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title="Cardápio"
              >
                <UtensilsCrossed size={20} />
                <span className="ml-1.5 hidden sm:inline">Cardápio</span>
              </Link>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="ml-1 flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            /* Customer cart button */
            onCartClick && (
              <button
                onClick={onCartClick}
                className="relative flex min-h-11 min-w-11 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                aria-label={`Sacola com ${count} itens`}
              >
                <ShoppingBag size={24} />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
