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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-lg flex-col rounded-t-3xl sm:rounded-3xl bg-[#18181c] border border-neutral-800 text-neutral-100 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-300 shadow-sm backdrop-blur-sm hover:bg-neutral-800 hover:text-white border border-neutral-700/60"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          {/* Product image */}
          <div className="aspect-video w-full overflow-hidden rounded-t-3xl bg-neutral-900">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5 p-5">
            {/* Name & description */}
            <div>
              <h2 className="text-xl font-bold text-white">{product.name}</h2>
              {product.description && (
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                  {product.description}
                </p>
              )}
            </div>

            {/* Variations */}
            {hasVariations && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
                  Escolha uma opção <span className="text-orange-500">*</span>
                </h3>
                <div className="flex flex-col gap-2">
                  {activeVariations.map((variation) => (
                    <label
                      key={variation.id}
                      className={`flex min-h-12 cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition-colors ${
                        selectedVariation?.id === variation.id
                          ? 'border-orange-500 bg-orange-950/30'
                          : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
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
                        <span className="text-sm font-medium text-neutral-200">
                          {variation.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-neutral-300">
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
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
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
                            ? 'border-orange-500 bg-orange-950/30'
                            : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAddon(addon)}
                            className="h-4 w-4 rounded accent-orange-500"
                          />
                          <span className="text-sm font-medium text-neutral-200">
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-400">
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
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
                Observações
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={140}
                placeholder="Ex: Sem cebola, molho à parte..."
                rows={2}
                className="w-full resize-none rounded-xl border-2 border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
              />
              <p className="mt-1 text-right text-xs text-neutral-500">
                {notes.length}/140
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-300">Quantidade</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-700 text-neutral-300 transition-colors disabled:opacity-30 hover:border-orange-400 hover:text-orange-400 cursor-pointer"
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center text-lg font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500 text-white transition-colors hover:bg-orange-600 cursor-pointer"
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Price display */}
            <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-4">
              <div className="flex items-center justify-between text-sm text-neutral-400">
                <span>Preço unitário</span>
                <span className="text-neutral-200">{formatPrice(unitPrice)}</span>
              </div>
              {quantity > 1 && (
                <div className="mt-1 flex items-center justify-between text-base font-bold text-white">
                  <span>Subtotal ({quantity}x)</span>
                  <span className="text-orange-400">{formatPrice(subtotal)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed add button */}
        <div className="border-t border-neutral-800 bg-[#18181c] p-4">
          <button
            onClick={handleAdd}
            disabled={!isValid}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-orange-500 text-base font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 active:bg-orange-700 hover:bg-orange-600 shadow-lg shadow-orange-500/25 cursor-pointer"
          >
            Adicionar à sacola — {formatPrice(subtotal)}
          </button>
        </div>
      </div>
    </div>
  );
}
