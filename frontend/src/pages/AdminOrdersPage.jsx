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
  Utensils,
  Bike,
  MapPin,
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
  const { adminOrders, setAdminOrders, advanceOrderStatus, cancelOrder } = useOrders();
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

  // Polling / Refresh from localStorage
  const doRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      const saved = localStorage.getItem('foodexpress_orders');
      if (saved && setAdminOrders) {
        setAdminOrders(JSON.parse(saved));
      }
    } catch {
      // Ignora erro de parsing no refresh do localStorage
    }
    setTimeout(() => setRefreshing(false), 500);
  }, [setAdminOrders]);

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
    <div className="min-h-screen bg-[#0f0f11] text-neutral-100">
      <Navbar isAdmin onLogout={logout} />

      <div className="max-w-5xl mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
              <ClipboardList className="w-7 h-7 text-orange-500" />
              Painel de Pedidos
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Acompanhamento da fila da cozinha e entregas em tempo real
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={doRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold bg-[#18181c] border border-neutral-800 text-neutral-200 rounded-xl hover:bg-neutral-800 active:bg-neutral-700 shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-orange-500' : 'text-neutral-400'}`} />
              <span>Atualizar</span>
            </button>

            <div className="flex items-center gap-1.5 bg-[#18181c] border border-neutral-800 rounded-xl px-3 py-2 shadow-xs">
              <Timer className="w-4 h-4 text-orange-500" />
              <select
                value={pollMs}
                onChange={handlePollChange}
                className="text-xs sm:text-sm font-semibold bg-transparent border-none focus:outline-none text-neutral-200 cursor-pointer"
              >
                {INTERVAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-neutral-900 text-neutral-200">
                    Auto: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-[#18181c] p-4 rounded-2xl border border-neutral-800 shadow-xs">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Novos</span>
            <span className="text-2xl font-black text-blue-400 mt-1 block">
              {adminOrders.filter((o) => o.status === 'RECEIVED').length}
            </span>
          </div>
          <div className="bg-[#18181c] p-4 rounded-2xl border border-neutral-800 shadow-xs">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Em Preparo</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">
              {adminOrders.filter((o) => o.status === 'PREPARING').length}
            </span>
          </div>
          <div className="bg-[#18181c] p-4 rounded-2xl border border-neutral-800 shadow-xs">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Prontos</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              {adminOrders.filter((o) => o.status === 'READY').length}
            </span>
          </div>
          <div className="bg-[#18181c] p-4 rounded-2xl border border-neutral-800 shadow-xs">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Finalizados</span>
            <span className="text-2xl font-black text-neutral-300 mt-1 block">
              {adminOrders.filter((o) => o.status === 'DELIVERED').length}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 bg-[#18181c] rounded-2xl p-1.5 shadow-xs border border-neutral-800 mb-6 overflow-x-auto">
          {TAB_FILTERS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-fit px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <PackageOpen className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 font-medium">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      className={`bg-[#18181c] rounded-2xl border border-neutral-800 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between ${
        isReceived ? 'border-l-4 border-l-orange-500' : ''
      }`}
    >
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white">#{order.id}</span>
              <span className="text-xs text-neutral-500">{formatRelativeTime(order.createdAt)}</span>
            </div>
            <div className="text-sm text-neutral-300 mt-0.5 flex items-center gap-1.5">
              {order.orderType === 'DINE_IN' ? (
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Utensils className="w-3.5 h-3.5 text-orange-500" />
                  Mesa {order.tableNumber}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Bike className="w-3.5 h-3.5 text-blue-400" />
                  Entrega - {order.customerName}
                </span>
              )}
            </div>
            {order.deliveryAddress && (
              <p className="text-xs text-neutral-400 mt-0.5 inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                {order.deliveryAddress}
              </p>
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
          className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 font-medium mt-1 min-h-[44px] cursor-pointer"
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
          <div className="mt-2 space-y-2 border-t border-neutral-800 pt-3">
            {order.items.map((item) => {
              const itemAddons = addons(item);
              return (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-medium text-neutral-200">
                        {item.quantity}x {item.productNameSnapshot}
                        {item.variationNameSnapshot && (
                          <span className="text-neutral-400"> ({item.variationNameSnapshot})</span>
                        )}
                      </span>
                      {itemAddons.length > 0 && (
                        <p className="text-xs text-neutral-400 mt-0.5">
                          + {itemAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-amber-400 italic mt-0.5">
                          Obs: {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="text-neutral-300 ml-2 whitespace-nowrap">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-800">
          <span className="text-sm text-neutral-400">Total</span>
          <span className="font-bold text-white text-lg">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {/* Action buttons */}
      {!isTerminal && (
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={onAdvance}
            className="flex-1 h-11 bg-[#c2410c] hover:bg-[#d9531e] active:bg-[#9a3412] text-white font-semibold text-sm rounded-xl transition shadow-md shadow-black/30 cursor-pointer"
          >
            {getNextStatusLabel(order.status)}
          </button>
          <button
            onClick={onCancel}
            className="h-11 px-4 border-2 border-red-500/40 text-red-400 hover:bg-red-950/30 active:bg-red-900/50 font-semibold text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
