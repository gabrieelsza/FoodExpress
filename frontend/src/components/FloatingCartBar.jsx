import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

export default function FloatingCartBar({ itemCount, total, onClick }) {
  if (!itemCount || itemCount <= 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-lg animate-in slide-in-from-bottom duration-300"
    >
      <div className="mx-3 mb-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-4 shadow-lg shadow-orange-200/50 transition-transform active:scale-[0.98]">
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} className="text-white" />
          <span className="text-sm font-semibold text-white">
            Ver sacola ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
          </span>
        </div>
        <span className="text-base font-bold text-white">
          {formatPrice(total)}
        </span>
      </div>
    </button>
  );
}
