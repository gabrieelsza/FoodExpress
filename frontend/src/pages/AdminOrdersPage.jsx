import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  PackageOpen,
  RefreshCw,
  Timer,
  X,
  Utensils,
  Bike,
  MapPin,
  Flame,
  ChefHat,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { ORDER_STATUS_SEQUENCE } from '../data/mockData';
import { formatPrice, formatRelativeTime } from '../utils/helpers';
import Navbar from '../components/Navbar';
import ScrollReveal from '../components/ScrollReveal';

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

  const countActive = useMemo(
    () => adminOrders.filter((o) => ['RECEIVED', 'PREPARING', 'READY'].includes(o.status)).length,
    [adminOrders]
  );
  const countDelivered = useMemo(
    () => adminOrders.filter((o) => o.status === 'DELIVERED').length,
    [adminOrders]
  );
  const countCancelled = useMemo(
    () => adminOrders.filter((o) => o.status === 'CANCELLED').length,
    [adminOrders]
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased flex flex-col selection:bg-orange-600">
      <Navbar isAdmin onLogout={logout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        {/* Header com Status em Tempo Real */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#121214] border border-zinc-800 text-orange-500 shadow-xl shrink-0">
              <ClipboardList className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-tight leading-none">
                  Painel de Pedidos
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase font-['Oswald',sans-serif] tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ao Vivo
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Fila de cozinha KDS e entregas com transição em tempo real
              </p>
            </div>
          </div>

          {/* Controles de Atualização */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={doRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold uppercase font-['Oswald',sans-serif] tracking-wider bg-[#121214] hover:bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-orange-500' : 'text-zinc-400'}`} />
              <span>Atualizar</span>
            </button>

            <div className="flex items-center gap-2 bg-[#121214] border border-zinc-800 rounded-xl px-3 py-2 shadow-lg">
              <Timer className="w-4 h-4 text-orange-500" />
              <select
                value={pollMs}
                onChange={handlePollChange}
                className="text-xs sm:text-sm font-bold uppercase font-['Oswald',sans-serif] tracking-wider bg-transparent border-none focus:outline-none text-zinc-300 cursor-pointer"
              >
                {INTERVAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-200">
                    Auto: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumo de Indicadores Operacionais (KPIs) */}
        <ScrollReveal direction="up" duration={700}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
            <div className="bg-[#121214] p-4 sm:p-5 rounded-2xl border border-zinc-800 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-['Oswald',sans-serif] block">
                  Novos Pedidos
                </span>
                <span className="text-3xl font-black text-blue-400 mt-0.5 block font-['Oswald',sans-serif]">
                  {adminOrders.filter((o) => o.status === 'RECEIVED').length}
                </span>
                <span className="text-[10px] text-zinc-500">Aguardando início</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Flame className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#121214] p-4 sm:p-5 rounded-2xl border border-zinc-800 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-['Oswald',sans-serif] block">
                  Em Preparo
                </span>
                <span className="text-3xl font-black text-amber-400 mt-0.5 block font-['Oswald',sans-serif]">
                  {adminOrders.filter((o) => o.status === 'PREPARING').length}
                </span>
                <span className="text-[10px] text-zinc-500">Na grelha / montagem</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ChefHat className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#121214] p-4 sm:p-5 rounded-2xl border border-zinc-800 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-['Oswald',sans-serif] block">
                  Prontos
                </span>
                <span className="text-3xl font-black text-emerald-400 mt-0.5 block font-['Oswald',sans-serif]">
                  {adminOrders.filter((o) => o.status === 'READY').length}
                </span>
                <span className="text-[10px] text-zinc-500">Aguardando entrega</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#121214] p-4 sm:p-5 rounded-2xl border border-zinc-800 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-['Oswald',sans-serif] block">
                  Finalizados
                </span>
                <span className="text-3xl font-black text-zinc-300 mt-0.5 block font-['Oswald',sans-serif]">
                  {adminOrders.filter((o) => o.status === 'DELIVERED').length}
                </span>
                <span className="text-[10px] text-zinc-500">Entregues no turno</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center text-zinc-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Abas com Contadores */}
        <div className="flex gap-1.5 bg-[#121214] rounded-2xl p-1.5 border border-zinc-800 mb-7 overflow-x-auto shadow-xl">
          {TAB_FILTERS.map((tab) => {
            const count =
              tab.key === 'active'
                ? countActive
                : tab.key === 'all'
                ? adminOrders.length
                : tab.key === 'delivered'
                ? countDelivered
                : countCancelled;

            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-fit px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider font-['Oswald',sans-serif] rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Fila de Pedidos */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-[#121214] rounded-3xl border border-zinc-800 shadow-xl">
            <PackageOpen className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white uppercase font-['Oswald',sans-serif] tracking-wider">
              Nenhum pedido encontrado
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
              Nenhum pedido nesta fila no momento. Novos pedidos de mesa ou delivery aparecerão aqui em tempo real.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredOrders.map((order, idx) => (
              <ScrollReveal key={order.id} direction="up" delay={idx * 60} duration={600}>
                <OrderCard
                  order={order}
                  onAdvance={() => handleAdvance(order)}
                  onCancel={() => handleCancel(order)}
                />
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------- Card Operacional de Pedido ---------- */

function OrderCard({ order, onAdvance, onCancel }) {
  const isTerminal = order.status === 'DELIVERED' || order.status === 'CANCELLED';

  const statusConfig = {
    RECEIVED: {
      label: 'Novo Pedido',
      badgeClass: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
      dotClass: 'bg-blue-400',
      btnBg: 'bg-orange-600 hover:bg-orange-500 shadow-orange-950/50',
      icon: Flame,
    },
    PREPARING: {
      label: 'Em Preparo',
      badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
      dotClass: 'bg-amber-400 animate-pulse',
      btnBg: 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/50',
      icon: ChefHat,
    },
    READY: {
      label: 'Pronto p/ Entrega',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
      dotClass: 'bg-emerald-400',
      btnBg: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50',
      icon: CheckCircle2,
    },
    DELIVERED: {
      label: 'Entregue',
      badgeClass: 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/50',
      dotClass: 'bg-zinc-500',
      btnBg: 'bg-zinc-700',
      icon: CheckCircle2,
    },
    CANCELLED: {
      label: 'Cancelado',
      badgeClass: 'bg-red-500/10 text-red-400 border border-red-500/30',
      dotClass: 'bg-red-500',
      btnBg: 'bg-zinc-800',
      icon: X,
    },
  }[order.status] || {
    label: order.status,
    badgeClass: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    dotClass: 'bg-zinc-400',
    btnBg: 'bg-orange-600',
    icon: Flame,
  };

  const ActionIcon = statusConfig.icon;

  const addons = (item) => {
    try {
      const parsed =
        typeof item.addonsJsonSnapshot === 'string'
          ? JSON.parse(item.addonsJsonSnapshot)
          : item.addonsJsonSnapshot;
      return parsed || [];
    } catch {
      return [];
    }
  };

  return (
    <div className="bg-[#121214] rounded-2xl sm:rounded-3xl border border-zinc-800 hover:border-zinc-700/80 shadow-2xl transition-all overflow-hidden flex flex-col justify-between">
      {/* Topo do Card */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-tight">
                Pedido #{order.id}
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                {formatRelativeTime(order.createdAt)}
              </span>
            </div>

            {/* Tipo de Atendimento: Salão / Delivery */}
            <div className="mt-1 flex items-center gap-2">
              {order.orderType === 'DINE_IN' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400 uppercase font-['Oswald',sans-serif] tracking-wider">
                  <Utensils className="w-3.5 h-3.5" />
                  Salão — Mesa {order.tableNumber}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 uppercase font-['Oswald',sans-serif] tracking-wider">
                  <Bike className="w-3.5 h-3.5" />
                  Delivery — {order.customerName}
                </span>
              )}
            </div>

            {order.deliveryAddress && (
              <p className="text-xs text-zinc-400 mt-1.5 flex items-center gap-1.5 leading-tight">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{order.deliveryAddress}</span>
              </p>
            )}
          </div>

          {/* Badge de Status */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-['Oswald',sans-serif] shrink-0 ${statusConfig.badgeClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
            {statusConfig.label}
          </span>
        </div>

        {/* Lista de Itens do Pedido */}
        <div className="mt-4 pt-4 border-t border-zinc-800/80">
          <div className="space-y-3">
            {order.items.map((item) => {
              const itemAddons = addons(item);
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start justify-between gap-3 text-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-black text-xs font-['Oswald',sans-serif]">
                        {item.quantity}x
                      </span>
                      <span className="font-bold text-white text-sm">
                        {item.productNameSnapshot}
                      </span>
                      {item.variationNameSnapshot && (
                        <span className="text-xs font-medium text-zinc-400">
                          ({item.variationNameSnapshot})
                        </span>
                      )}
                    </div>

                    {itemAddons.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {itemAddons.map((addon, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium"
                          >
                            + {addon.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.notes && (
                      <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/50 text-xs text-amber-300 flex items-center gap-1.5 font-medium">
                        <span>⚠️ Obs:</span>
                        <span>{item.notes}</span>
                      </div>
                    )}
                  </div>

                  <span className="font-bold text-zinc-200 text-sm whitespace-nowrap pt-0.5">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totalizador */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/80">
          <span className="text-xs uppercase font-bold text-zinc-400 font-['Oswald',sans-serif] tracking-wider">
            Total do Pedido
          </span>
          <span className="text-2xl font-black text-white font-['Oswald',sans-serif] tracking-tight">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </div>

      {/* Botões de Ação Operacional */}
      {!isTerminal && (
        <div className="flex gap-2.5 p-5 pt-0">
          <button
            onClick={onAdvance}
            className={`flex-1 h-12 ${statusConfig.btnBg} active:scale-[0.98] text-white font-bold uppercase tracking-wider font-['Oswald',sans-serif] text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer`}
          >
            <ActionIcon className="w-4 h-4" />
            <span>{getNextStatusLabel(order.status)}</span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>
          <button
            onClick={onCancel}
            className="h-12 px-4 rounded-xl border border-zinc-700/80 hover:border-red-500/60 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 font-bold uppercase tracking-wider font-['Oswald',sans-serif] text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Cancelar este pedido"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Cancelar</span>
          </button>
        </div>
      )}
    </div>
  );
}
