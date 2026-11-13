import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

export default function FloatingCartBar({ itemCount, totalItems, total, totalPrice, onClick }) {
  const count = itemCount ?? totalItems ?? 0;
  const price = total ?? totalPrice ?? 0;
  if (!count || count <= 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-lg animate-in slide-in-from-bottom duration-300"
    >
      <div className="mx-3 mb-3 flex items-center justify-between rounded-2xl bg-[#c2410c] hover:bg-[#d9531e] px-5 py-4 shadow-xl shadow-black/60 transition-transform active:scale-[0.98] cursor-pointer border border-[#832604]">
        <div className="flex items-center gap-2.5">
          <ShoppingBag size={20} className="text-white" />
          <span className="text-sm font-black text-white font-['Oswald',sans-serif] uppercase tracking-wider">
            Ver sacola ({count} {count === 1 ? 'item' : 'itens'})
          </span>
        </div>
        <span className="text-base sm:text-lg font-black text-white font-['Oswald',sans-serif] tracking-wide">
          {formatPrice(price)}
        </span>
      </div>
    </button>
  );
}
