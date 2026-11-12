import { Plus, SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

export default function ProductCard({ product, onAdd }) {
  if (!product) return null;

  const activeVariations = product.variations?.filter((v) => v.active) || [];
  const activeAddons = product.addons?.filter((a) => a.active) || [];
  const hasVariations = activeVariations.length > 0;
  const hasAddons = activeAddons.length > 0;

  const minPrice = hasVariations
    ? Math.min(...activeVariations.map((v) => v.price))
    : product.basePrice;

  return (
    <div
      onClick={() => onAdd(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-gray-100/90 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200/80 hover:-translate-y-1 cursor-pointer"
    >
      {/* Top: Product Image */}
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            loading="lazy"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {hasVariations && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-gray-800 shadow-sm border border-gray-200/40">
                <SlidersHorizontal size={11} className="text-orange-500" />
                Opções
              </span>
            )}
            {hasAddons && !hasVariations && (
              <span className="inline-flex items-center rounded-full bg-amber-500/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                + Adicionais
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {product.description || 'Ingredientes selecionados e preparados na hora com o padrão FoodExpress.'}
          </p>
        </div>
      </div>

      {/* Footer: Price + Button */}
      <div className="flex items-center justify-between p-4 sm:p-5 pt-0 border-t border-transparent">
        <div className="flex flex-col">
          {hasVariations ? (
            <>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                A partir de
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">
                {formatPrice(minPrice)}
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Preço
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-orange-600 leading-tight">
                {formatPrice(product.basePrice)}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-orange-50 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-orange-600 transition-all hover:bg-orange-500 hover:text-white shadow-xs group-hover:bg-orange-500 group-hover:text-white"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Pedir</span>
        </button>
      </div>
    </div>
  );
}
