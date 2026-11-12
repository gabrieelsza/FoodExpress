import { Plus, SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

export default function ProductCard({ product, onAdd }) {
  if (!product) return null;

  const activeVariations = product.variations?.filter((v) => v.active) || [];
  const activeAddons = product.addons?.filter((a) => a.active) || [];
  const hasVariations = activeVariations.length > 0;

  const minPrice = hasVariations
    ? Math.min(...activeVariations.map((v) => v.price))
    : product.basePrice;

  return (
    <div
      onClick={() => onAdd(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#18181c] border border-neutral-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-200 hover:shadow-xl hover:shadow-black/50 hover:border-neutral-700 hover:-translate-y-0.5 cursor-pointer text-white"
    >
      <div>
        {/* Product Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Customization badge */}
          {hasVariations && (
            <div className="absolute bottom-2.5 left-2.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900/90 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-semibold text-neutral-200 shadow-sm border border-neutral-700/60">
                <SlidersHorizontal size={11} className="text-orange-400" />
                Variações
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-4.5">
          <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="mt-1 text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description || 'Ingredientes selecionados e preparados com o padrão FoodExpress.'}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & CTA */}
      <div className="flex items-center justify-between p-4 sm:p-4.5 pt-0">
        <div>
          {hasVariations && (
            <span className="block text-[11px] font-medium text-neutral-500">
              A partir de
            </span>
          )}
          <span className="text-base sm:text-lg font-bold text-white">
            {formatPrice(minPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          className="inline-flex items-center gap-1 rounded-xl bg-orange-500/15 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/30 px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Pedir</span>
        </button>
      </div>
    </div>
  );
}
