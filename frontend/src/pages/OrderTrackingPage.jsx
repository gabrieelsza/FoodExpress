import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';
import { RESTAURANT_CONFIG, ORDER_STATUS } from '../data/mockData';
import {
  formatPrice,
  generateWhatsAppMessage,
  generateWhatsAppUrl,
  canCustomerCancel,
  getRemainingCancelSeconds,
  formatTime,
  formatRelativeTime,
} from '../utils/helpers';
import Navbar from '../components/Navbar';
import OrderStatusStepper from '../components/OrderStatusStepper';
import {
  ArrowLeft,
  MessageCircle,
  XCircle,
  ShoppingBag,
  UtensilsCrossed,
  Truck,
  AlertCircle,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, currentOrder, cancelOrder } = useOrders();

  // Refresh ticker — increments to force re-render and re-read order state
  const [tick, setTick] = useState(0);

  // Auto-refresh order status every 10 seconds (demo simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Look up order
  const order = useMemo(() => {
    // Re-evaluate on tick changes
    void tick;
    return getOrder(orderId) || currentOrder;
  }, [getOrder, orderId, currentOrder, tick]);

  // Cancel timer countdown
  const [cancelRemaining, setCancelRemaining] = useState(0);

  useEffect(() => {
    if (!order) return;

    const update = () => {
      if (canCustomerCancel(order)) {
        setCancelRemaining(getRemainingCancelSeconds(order.createdAt));
      } else {
        setCancelRemaining(0);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [order]);

  // ---- Handlers ----
  const handleCancel = useCallback(() => {
    if (!order) return;
    const confirmed = window.confirm(
      'Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.'
    );
    if (confirmed) {
      cancelOrder(order.id);
    }
  }, [order, cancelOrder]);

  const handleWhatsApp = useCallback(() => {
    if (!order) return;
    const message = generateWhatsAppMessage(order);
    const url = generateWhatsAppUrl(RESTAURANT_CONFIG.whatsappNumber, message);
    window.open(url, '_blank');
  }, [order]);

  // ---- Order not found ----
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin={false} />
        <div className="flex flex-col items-center justify-center px-6 py-20">
          <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
          <h1 className="text-xl font-bold text-gray-700 mb-2">Pedido não encontrado</h1>
          <p className="text-gray-500 text-center mb-6">
            Não conseguimos localizar o pedido #{orderId}. Verifique o número ou faça um novo
            pedido.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors min-h-[44px]"
          >
            <ShoppingBag className="w-5 h-5" />
            Ir para o cardápio
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = ORDER_STATUS[order.status] || ORDER_STATUS.RECEIVED;
  const isCancelled = order.status === 'CANCELLED';
  const isDelivery = order.orderType === 'DELIVERY';
  const showCancelButton = canCustomerCancel(order) && cancelRemaining > 0;

  // Parse addons from JSON string
  const parseAddons = (addonsJson) => {
    try {
      return typeof addonsJson === 'string' ? JSON.parse(addonsJson) : addonsJson || [];
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <Navbar isAdmin={false} />

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Back to menu */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-orange-600 text-sm mb-4 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao cardápio
        </button>

        {/* Order Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-gray-800">Pedido #{order.id}</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgLight} ${statusConfig.textColor}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <p className="text-sm text-gray-400">{formatRelativeTime(order.createdAt)}</p>

          {/* Order type indicator */}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
            {isDelivery ? (
              <>
                <Truck className="w-4 h-4 text-orange-500" />
                <span>
                  Entrega — <strong>{order.customerName}</strong>
                </span>
              </>
            ) : (
              <>
                <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                <span>
                  Mesa <strong>{order.tableNumber}</strong>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Status Stepper */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Acompanhamento
          </h2>
          <OrderStatusStepper currentStatus={order.status} />
        </div>

        {/* WhatsApp button for delivery orders */}
        {isDelivery && !isCancelled && (
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-colors mb-4 min-h-[44px]"
          >
            <MessageCircle className="w-5 h-5" />
            Enviar pelo WhatsApp
          </button>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Itens do pedido
          </h2>

          <div className="space-y-4">
            {order.items.map((item) => {
              const addons = parseAddons(item.addonsJsonSnapshot);
              return (
                <div
                  key={item.id}
                  className="flex justify-between gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800">
                      {item.quantity}x {item.productNameSnapshot}
                    </p>
                    {item.variationNameSnapshot && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        Variação: {item.variationNameSnapshot}
                      </p>
                    )}
                    {addons.length > 0 && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        + {addons.map((a) => a.name).join(', ')}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-sm text-orange-600 italic mt-0.5">Obs: {item.notes}</p>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <span className="text-base font-bold text-gray-800">Total</span>
            <span className="text-lg font-bold text-orange-600">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Cancel Button */}
        {showCancelButton && (
          <button
            onClick={handleCancel}
            className="w-full flex items-center justify-center gap-2 border-2 border-red-400 text-red-600 hover:bg-red-50 font-semibold py-3.5 rounded-xl transition-colors mb-4 min-h-[44px]"
          >
            <XCircle className="w-5 h-5" />
            Cancelar pedido ({formatTime(cancelRemaining)})
          </button>
        )}

        {/* New order link */}
        <Link
          to="/"
          className="block w-full text-center text-orange-600 hover:text-orange-700 font-semibold py-3 transition-colors min-h-[44px]"
        >
          Fazer novo pedido
        </Link>
      </div>
    </div>
  );
}
