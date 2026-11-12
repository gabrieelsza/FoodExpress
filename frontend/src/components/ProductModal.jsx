import { useEffect, useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { formatPrice, calculateItemPrice } from '../utils/helpers';

export default function ProductModal({ product, onClose, onAdd }) {
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const activeVariations = product?.variations?.filter((v) => v.active) || [];
  const activeAddons = product?.addons?.filter((a) => a.active) || [];
  const hasVariations = activeVariations.length > 0;

  // Auto-select first variation if required
  useEffect(() => {
    if (hasVariations && !selectedVariation) {
      setSelectedVariation(activeVariations[0]);
    }
  }, [product]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!product) return null;

  const unitPrice = calculateItemPrice(product, selectedVariation, selectedAddons);
  const subtotal = unitPrice * quantity;

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) return prev.filter((a) => a.id !== addon.id);
      return [...prev, addon];
    });
  };

  const handleAdd = () => {
    onAdd({
      product,
      variation: selectedVariation,
      addons: selectedAddons,
      notes: notes.trim(),
      quantity,
    });
    onClose();
  };

  const isValid = !hasVariations || selectedVariation;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-xl animate-in slide-in-from-bottom duration-300"
        style={{ maxHeight: '85vh' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow-sm backdrop-blur-sm hover:bg-white"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          {/* Product image */}
          <div className="aspect-video w-full overflow-hidden rounded-t-3xl">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5 p-5">
            {/* Name & description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
              {product.description && (
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {product.description}
                </p>
              )}
            </div>

            {/* Variations */}
            {hasVariations && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Escolha uma opção <span className="text-orange-500">*</span>
                </h3>
                <div className="flex flex-col gap-2">
                  {activeVariations.map((variation) => (
                    <label
                      key={variation.id}
                      className={`flex min-h-12 cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition-colors ${
                        selectedVariation?.id === variation.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="variation"
                          value={variation.id}
                          checked={selectedVariation?.id === variation.id}
                          onChange={() => setSelectedVariation(variation)}
                          className="h-4 w-4 accent-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {variation.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {formatPrice(variation.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Addons */}
            {activeAddons.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Adicionais
                </h3>
                <div className="flex flex-col gap-2">
                  {activeAddons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex min-h-12 cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition-colors ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAddon(addon)}
                            className="h-4 w-4 rounded accent-orange-500"
                          />
                          <span className="text-sm font-medium text-gray-800">
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          +{formatPrice(addon.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Observations */}
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-700">
                Observações
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={140}
                placeholder="Ex: Sem cebola, molho à parte..."
                rows={2}
                className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-orange-400 focus:outline-none"
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {notes.length}/140
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Quantidade</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 text-gray-600 transition-colors disabled:opacity-40 hover:border-orange-400 hover:text-orange-500"
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center text-lg font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500 text-white transition-colors hover:bg-orange-600"
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Price display */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Preço unitário</span>
                <span>{formatPrice(unitPrice)}</span>
              </div>
              {quantity > 1 && (
                <div className="mt-1 flex items-center justify-between text-base font-bold text-gray-900">
                  <span>Subtotal ({quantity}x)</span>
                  <span className="text-orange-600">{formatPrice(subtotal)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed add button */}
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleAdd}
            disabled={!isValid}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-orange-500 text-base font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 active:bg-orange-700 hover:bg-orange-600"
          >
            Adicionar à sacola — {formatPrice(subtotal)}
          </button>
        </div>
      </div>
    </div>
  );
}
