import { formatPrice } from '../utils/helpers';

export default function ProductCard({ product, onAdd }) {
  if (!product) return null;

  const activeVariations = product.variations?.filter((v) => v.active) || [];
  const hasVariations = activeVariations.length > 0;

  const minPrice = hasVariations
    ? Math.min(...activeVariations.map((v) => v.price))
    : product.basePrice;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Product image */}
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Product info */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>

        {product.description && (
          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
            {product.description}
          </p>
        )}

        <div className="mt-1">
          {hasVariations ? (
            <span className="text-sm font-medium text-gray-700">
              A partir de{' '}
              <span className="text-base font-bold text-orange-600">
                {formatPrice(minPrice)}
              </span>
            </span>
          ) : (
            <span className="text-base font-bold text-orange-600">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => onAdd(product)}
          className="mt-2 flex h-11 w-full items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white transition-colors active:bg-orange-700 hover:bg-orange-600"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
