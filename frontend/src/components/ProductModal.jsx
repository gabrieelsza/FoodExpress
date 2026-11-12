import { useEffect, useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { formatPrice, calculateItemPrice, sanitizeProductImageUrl, getFallbackFoodImage } from '../utils/helpers';

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
      <div className="relative z-10 flex w-full max-w-lg flex-col rounded-t-3xl sm:rounded-3xl bg-[#14110f] border border-[#2d241e] text-stone-100 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#100d0b]/85 text-stone-300 shadow-md backdrop-blur-sm hover:bg-[#1a1512] hover:text-white border border-[#3a3028]"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          {/* Product image */}
          <div className="aspect-video w-full overflow-hidden rounded-t-3xl bg-neutral-900">
            <img
              src={sanitizeProductImageUrl(product.imageUrl, product.name)}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getFallbackFoodImage(product.name);
              }}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5 p-5">
            {/* Name & description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Oswald',sans-serif] uppercase tracking-wide">{product.name}</h2>
              {product.description && (
                <p className="mt-1 text-sm leading-relaxed text-stone-400">
                  {product.description}
                </p>
              )}
            </div>

            {/* Variations */}
            {hasVariations && (
              <div>
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-amber-500 font-['Oswald',sans-serif]">
                  Escolha o tamanho / variação <span className="text-orange-500">*</span>
                </h3>
                <div className="flex flex-col gap-2">
                  {activeVariations.map((variation) => (
                    <label
                      key={variation.id}
                      className={`flex min-h-12 cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                        selectedVariation?.id === variation.id
                          ? 'border-orange-500 bg-red-950/40 text-white shadow-md'
                          : 'border-[#2d241e] bg-[#181411] text-stone-300 hover:border-stone-600'
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
                        <span className="text-sm font-semibold text-white font-['Oswald',sans-serif] uppercase tracking-wide">
                          {variation.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-amber-400 font-['Oswald',sans-serif]">
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
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-amber-500 font-['Oswald',sans-serif]">
                  Adicionais &amp; Acompanhamentos
                </h3>
                <div className="flex flex-col gap-2">
                  {activeAddons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex min-h-12 cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                          isSelected
                            ? 'border-orange-500 bg-orange-950/30 text-white'
                            : 'border-[#2d241e] bg-[#181411] text-stone-300 hover:border-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAddon(addon)}
                            className="h-4 w-4 rounded accent-orange-500"
                          />
                          <span className="text-sm font-medium text-stone-200">
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-amber-400 font-['Oswald',sans-serif]">
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
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400 font-['Oswald',sans-serif]">
                Observações
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={140}
                placeholder="Ex: Ponto da carne, sem cebola, molho à parte..."
                rows={2}
                className="w-full resize-none rounded-xl border border-[#2d241e] bg-[#100d0b] px-4 py-3 text-sm text-stone-100 placeholder-stone-500 transition-colors focus:border-orange-500 focus:outline-none"
              />
              <p className="mt-1 text-right text-xs text-stone-500">
                {notes.length}/140
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-300 uppercase tracking-wider font-['Oswald',sans-serif]">Quantidade</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3a3028] bg-[#181411] text-stone-300 transition-colors disabled:opacity-30 hover:border-orange-400 hover:text-orange-400 cursor-pointer"
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center text-lg font-black text-white font-['Oswald',sans-serif]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white transition-colors hover:from-red-700 hover:to-orange-600 shadow-md cursor-pointer"
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Price display */}
            <div className="rounded-xl bg-[#100d0b] border border-[#2d241e] p-4">
              <div className="flex items-center justify-between text-sm text-stone-400">
                <span>Preço unitário</span>
                <span className="text-stone-200 font-bold font-['Oswald',sans-serif]">{formatPrice(unitPrice)}</span>
              </div>
              {quantity > 1 && (
                <div className="mt-1 flex items-center justify-between text-base font-bold text-white">
                  <span>Subtotal ({quantity}x)</span>
                  <span className="text-amber-400 font-black font-['Oswald',sans-serif]">{formatPrice(subtotal)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed add button */}
        <div className="border-t border-[#26201b] bg-[#14110f] p-4">
          <button
            onClick={handleAdd}
            disabled={!isValid}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 active:scale-[0.98] text-base font-black text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-orange-950/70 uppercase font-['Oswald',sans-serif] tracking-wider cursor-pointer"
          >
            Adicionar à sacola — {formatPrice(subtotal)}
          </button>
        </div>
      </div>
    </div>
  );
}
