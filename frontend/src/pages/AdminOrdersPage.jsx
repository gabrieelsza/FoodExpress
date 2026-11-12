import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  PackageOpen,
  RefreshCw,
  Timer,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { ORDER_STATUS, ORDER_STATUS_SEQUENCE } from '../data/mockData';
import { formatPrice, formatRelativeTime } from '../utils/helpers';
import Navbar from '../components/Navbar';

const POLL_KEY = 'foodexpress_poll_ms';

const INTERVAL_OPTIONS = [
  { label: '10s', value: 10_000 },
  { label: '30s', value: 30_000 },
  { label: '1 min', value: 60_000 },
  { label: '3 min', value: 180_000 },
  { label: '5 min', value: 300_000 },
  { label: '10 min', value: 600_000 },
];

const TAB_FILTERS = [
  { key: 'active', label: 'Ativos' },
  { key: 'all', label: 'Todos' },
  { key: 'delivered', label: 'Entregues' },
  { key: 'cancelled', label: 'Cancelados' },
];

function getNextStatusLabel(currentStatus) {
  switch (currentStatus) {
    case 'RECEIVED':
      return 'Iniciar Preparo';
    case 'PREPARING':
      return 'Marcar Pronto';
    case 'READY':
      return 'Marcar Entregue';
    default:
      return 'Avançar';
  }
}

const statusSortOrder = { RECEIVED: 0, PREPARING: 1, READY: 2, DELIVERED: 3, CANCELLED: 4 };

export default function AdminOrdersPage() {
  const { isAuthenticated, logout } = useAuth();
  const { adminOrders, advanceOrderStatus, cancelOrder } = useOrders();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('active');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [pollMs, setPollMs] = useState(() => {
    const saved = localStorage.getItem(POLL_KEY);
    return saved ? Number(saved) : 300_000;
  });
  const intervalRef = useRef(null);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Polling
  const doRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh (no real API)
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(doRefresh, pollMs);
    return () => clearInterval(intervalRef.current);
  }, [pollMs, doRefresh]);

  const handlePollChange = (e) => {
    const val = Number(e.target.value);
    setPollMs(val);
    localStorage.setItem(POLL_KEY, String(val));
  };

  const toggleExpanded = (orderId) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const handleAdvance = (order) => {
    const currentIdx = ORDER_STATUS_SEQUENCE.indexOf(order.status);
    if (currentIdx < 0 || currentIdx >= ORDER_STATUS_SEQUENCE.length - 1) return;
    const nextStatus = ORDER_STATUS_SEQUENCE[currentIdx + 1];
    advanceOrderStatus(order.id, nextStatus);
  };

  const handleCancel = (order) => {
    if (window.confirm(`Cancelar pedido #${order.id}?`)) {
      cancelOrder(order.id);
    }
  };

  // Filter + sort
  const filteredOrders = useMemo(() => {
    let list = [...adminOrders];

    switch (activeTab) {
      case 'active':
        list = list.filter((o) => ['RECEIVED', 'PREPARING', 'READY'].includes(o.status));
        break;
      case 'delivered':
        list = list.filter((o) => o.status === 'DELIVERED');
        break;
      case 'cancelled':
        list = list.filter((o) => o.status === 'CANCELLED');
        break;
      default:
        break;
    }

    list.sort((a, b) => {
      const sa = statusSortOrder[a.status] ?? 99;
      const sb = statusSortOrder[b.status] ?? 99;
      if (sa !== sb) return sa - sb;
      // Within same status, newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return list;
  }, [adminOrders, activeTab]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAdmin onLogout={logout} />

      <div className="max-w-2xl mx-auto px-4 pt-4 pb-24">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-orange-500" />
            Painel de Pedidos
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={doRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>

            <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-2 py-1.5">
              <Timer className="w-4 h-4 text-gray-400" />
              <select
                value={pollMs}
                onChange={handlePollChange}
                className="text-sm bg-transparent border-none focus:outline-none text-gray-700 cursor-pointer"
              >
                {INTERVAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm mb-4 overflow-x-auto">
          {TAB_FILTERS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-fit px-3 py-2 text-sm font-medium rounded-md transition whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <PackageOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedOrders.has(order.id)}
                onToggleExpanded={() => toggleExpanded(order.id)}
                onAdvance={() => handleAdvance(order)}
                onCancel={() => handleCancel(order)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Order Card ---------- */

function OrderCard({ order, expanded, onToggleExpanded, onAdvance, onCancel }) {
  const statusConfig = ORDER_STATUS[order.status] || {};
  const isTerminal = order.status === 'DELIVERED' || order.status === 'CANCELLED';
  const isReceived = order.status === 'RECEIVED';

  const addons = (item) => {
    try {
      const parsed = typeof item.addonsJsonSnapshot === 'string'
        ? JSON.parse(item.addonsJsonSnapshot)
        : item.addonsJsonSnapshot;
      return parsed || [];
    } catch {
      return [];
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${
        isReceived ? 'border-l-4 border-l-orange-500' : ''
      }`}
    >
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900">#{order.id}</span>
              <span className="text-xs text-gray-400">{formatRelativeTime(order.createdAt)}</span>
            </div>
            <div className="text-sm text-gray-600 mt-0.5">
              {order.orderType === 'DINE_IN' ? (
                <span>🍽️ Mesa {order.tableNumber}</span>
              ) : (
                <span>🛵 Entrega - {order.customerName}</span>
              )}
            </div>
            {order.deliveryAddress && (
              <p className="text-xs text-gray-400 mt-0.5">📍 {order.deliveryAddress}</p>
            )}
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color} text-white`}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Expandable items */}
        <button
          onClick={onToggleExpanded}
          className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium mt-1 min-h-[44px]"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" /> Ocultar itens
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> Ver itens ({order.items.length})
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-2 space-y-2 border-t border-gray-100 pt-3">
            {order.items.map((item) => {
              const itemAddons = addons(item);
              return (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">
                        {item.quantity}x {item.productNameSnapshot}
                        {item.variationNameSnapshot && (
                          <span className="text-gray-500"> ({item.variationNameSnapshot})</span>
                        )}
                      </span>
                      {itemAddons.length > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          + {itemAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-amber-600 italic mt-0.5">
                          Obs: {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="text-gray-600 ml-2 whitespace-nowrap">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">Total</span>
          <span className="font-bold text-gray-900 text-lg">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {/* Action buttons */}
      {!isTerminal && (
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={onAdvance}
            className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-lg transition"
          >
            {getNextStatusLabel(order.status)}
          </button>
          <button
            onClick={onCancel}
            className="h-11 px-4 border-2 border-red-300 text-red-600 hover:bg-red-50 active:bg-red-100 font-semibold text-sm rounded-lg transition flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
