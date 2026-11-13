import { Plus, SlidersHorizontal, Flame } from 'lucide-react';
import { formatPrice, sanitizeProductImageUrl, getFallbackFoodImage } from '../utils/helpers';

export default function ProductCard({ product, onAdd }) {
  if (!product) return null;

  const activeVariations = product.variations?.filter((v) => v.active) || [];
  const activeAddons = product.addons?.filter((a) => a.active) || [];
  const hasVariations = activeVariations.length > 0;

  const minPrice = hasVariations
    ? Math.min(...activeVariations.map((v) => v.price))
    : product.basePrice;

  const safeImageUrl = sanitizeProductImageUrl(product.imageUrl, product.name);

  return (
    <div
      onClick={() => onAdd(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#121214] border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:-translate-y-1 cursor-pointer text-zinc-100"
    >
      <div>
        {/* Product Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
          <img
            src={safeImageUrl}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getFallbackFoodImage(product.name);
            }}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            loading="lazy"
          />

          {/* Dark gradient overlay for appetizing contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/30 pointer-events-none" />

          {/* Customization badge */}
          {hasVariations && (
            <div className="absolute bottom-2.5 left-2.5 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-orange-400 shadow-md border border-zinc-800 font-['Oswald',sans-serif] uppercase tracking-wider">
                <SlidersHorizontal size={10} className="text-orange-400" />
                Variações
              </span>
            </div>
          )}

          {/* Sabor da Brasa badge on first few items or burgers */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-zinc-300 border border-zinc-800 shadow-sm uppercase font-['Oswald',sans-serif] tracking-wider">
              <Flame size={11} className="text-orange-500 fill-orange-500" />
              Na Brasa
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-4.5">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-stone-200 transition-colors line-clamp-1 font-['Oswald',sans-serif] tracking-wide uppercase">
            {product.name}
          </h3>

          <p className="mt-1 text-xs sm:text-sm text-stone-400 line-clamp-2 leading-relaxed">
            {product.description || 'Ingredientes nobres selecionados e preparados artesanalmente no padrão FoodExpress Steakhouse.'}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & CTA */}
      <div className="flex items-center justify-between p-4 sm:p-4.5 pt-0 mt-2">
        <div>
          {hasVariations && (
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 font-['Oswald',sans-serif]">
              A partir de
            </span>
          )}
          <span className="text-lg sm:text-xl font-extrabold text-stone-100 font-['Oswald',sans-serif] tracking-wide">
            {formatPrice(minPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#c2410c] hover:bg-[#d9531e] active:scale-95 text-white px-3.5 py-1.5 text-xs sm:text-sm font-bold shadow-md shadow-black/50 transition-all uppercase font-['Oswald',sans-serif] tracking-wider cursor-pointer"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Pedir</span>
        </button>
      </div>
    </div>
  );
}
