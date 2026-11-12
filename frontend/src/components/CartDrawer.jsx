import { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, Utensils, Bike, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/helpers';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCart();

  const [orderType, setOrderType] = useState('DINE_IN');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isEmpty = items.length === 0;
  const isDineIn = orderType === 'DINE_IN';
  const isDelivery = orderType === 'DELIVERY';

  const canCheckout =
    !isEmpty &&
    ((isDineIn && tableNumber.trim() !== '') ||
      (isDelivery && customerName.trim() !== ''));

  const handleCheckout = () => {
    if (!canCheckout) return;
    onCheckout({
      orderType,
      tableNumber: isDineIn ? tableNumber.trim() : null,
      customerName: isDelivery ? customerName.trim() : null,
      deliveryAddress: isDelivery ? deliveryAddress.trim() || null : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative z-10 flex w-full max-w-lg sm:max-w-md flex-col rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl bg-[#14110f] border-l border-[#2d241e] text-stone-100 shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 max-h-[92vh] sm:max-h-full sm:h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#26201b] px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-white font-['Oswald',sans-serif] uppercase tracking-wide">Sua Sacola</h2>
            {totalItems > 0 && (
              <p className="text-xs text-stone-400 font-medium">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'} no pedido
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-[#1f1915] hover:text-white cursor-pointer"
            aria-label="Fechar sacola"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-3 px-5 py-16 text-center">
              <ShoppingBag size={48} className="text-neutral-600 mb-1" strokeWidth={1.5} />
              <p className="text-base font-semibold text-neutral-300">
                Sua sacola está vazia
              </p>
              <p className="text-sm text-neutral-500 max-w-xs">
                Adicione itens do cardápio para fazer seu pedido.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Cart items */}
              <ul className="divide-y divide-neutral-800/80 px-5">
                {items.map((item) => (
                  <li key={item.cartItemId} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Item info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {item.productName}
                          {item.variationName && (
                            <span className="ml-1 font-normal text-neutral-400">
                              — {item.variationName}
                            </span>
                          )}
                        </p>
                        {item.addonsDetail?.length > 0 && (
                          <p className="mt-0.5 text-xs text-neutral-400">
                            + {item.addonsDetail.map((a) => a.name).join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="mt-0.5 text-xs italic text-neutral-400">
                            "{item.notes}"
                          </p>
                        )}
                      </div>

                      {/* Subtotal */}
                      <span className="shrink-0 text-sm font-semibold text-white">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.cartItemId)
                            : updateQuantity(item.cartItemId, item.quantity - 1)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-400 transition-colors hover:border-red-500 hover:text-red-400 cursor-pointer"
                        aria-label={
                          item.quantity === 1 ? 'Remover item' : 'Diminuir quantidade'
                        }
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={16} />
                        ) : (
                          <Minus size={16} />
                        )}
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-500 bg-orange-500 text-white transition-colors hover:bg-orange-600 cursor-pointer"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Order type section */}
              <div className="border-t border-neutral-800 px-5 py-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
                  Tipo do pedido
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderType('DINE_IN')}
                    className={`flex h-12 items-center justify-center gap-2 rounded-xl border-2 text-sm font-semibold transition-colors cursor-pointer ${
                      isDineIn
                        ? 'border-orange-500 bg-orange-950/30 text-orange-400'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <Utensils size={18} />
                    <span>Consumo no local</span>
                  </button>
                  <button
                    onClick={() => setOrderType('DELIVERY')}
                    className={`flex h-12 items-center justify-center gap-2 rounded-xl border-2 text-sm font-semibold transition-colors cursor-pointer ${
                      isDelivery
                        ? 'border-orange-500 bg-orange-950/30 text-orange-400'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <Bike size={18} />
                    <span>Entrega</span>
                  </button>
                </div>

                {/* Conditional fields */}
                <div className="mt-4 flex flex-col gap-3">
                  {isDineIn && (
                    <div>
                      <label
                        htmlFor="tableNumber"
                        className="mb-1 block text-sm font-medium text-neutral-300"
                      >
                        Número da mesa <span className="text-orange-500">*</span>
                      </label>
                      <input
                        id="tableNumber"
                        type="text"
                        inputMode="numeric"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Ex: 5"
                        className="h-11 w-full rounded-xl border-2 border-neutral-800 bg-neutral-900 px-4 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {isDelivery && (
                    <>
                      <div>
                        <label
                          htmlFor="customerName"
                          className="mb-1 block text-sm font-medium text-neutral-300"
                        >
                          Seu nome <span className="text-orange-500">*</span>
                        </label>
                        <input
                          id="customerName"
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ex: Maria Silva"
                          className="h-11 w-full rounded-xl border-2 border-neutral-800 bg-neutral-900 px-4 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="deliveryAddress"
                          className="mb-1 block text-sm font-medium text-neutral-300"
                        >
                          Endereço / Referência{' '}
                          <span className="text-neutral-500 text-xs">(opcional)</span>
                        </label>
                        <textarea
                          id="deliveryAddress"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Rua, número, complemento, referência..."
                          rows={2}
                          className="w-full resize-none rounded-xl border-2 border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Total + checkout button */}
        {!isEmpty && (
          <div className="border-t border-[#26201b] bg-[#14110f] px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-base font-bold text-stone-300 font-['Oswald',sans-serif] uppercase tracking-wide">Total</span>
              <span className="text-2xl font-black text-amber-400 font-['Oswald',sans-serif] tracking-wide">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={!canCheckout}
              className="flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 active:scale-[0.98] text-base font-black text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-orange-950/70 font-['Oswald',sans-serif] uppercase tracking-wider cursor-pointer"
            >
              Finalizar Pedido — {formatPrice(totalPrice)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
