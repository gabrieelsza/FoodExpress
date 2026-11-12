import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MOCK_ORDERS } from '../data/mockData';

const OrderContext = createContext(null);

const ORDERS_STORAGE_KEY = 'foodexpress_orders';
const LAST_ORDER_KEY = 'foodexpress_last_order_id';

function loadInitialOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  } catch {
    return MOCK_ORDERS;
  }
}

export function OrderProvider({ children }) {
  const [adminOrders, setAdminOrders] = useState(loadInitialOrders);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Sync orders to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(adminOrders));
    } catch {
      // Storage full or unavailable
    }
  }, [adminOrders]);

  const createOrder = useCallback((orderData) => {
    const newId = Date.now() % 100000;
    const newOrder = {
      id: newId,
      ...orderData,
      status: 'RECEIVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentOrder(newOrder);
    setAdminOrders((prev) => [newOrder, ...prev]);
    localStorage.setItem(LAST_ORDER_KEY, String(newOrder.id));
    return newOrder;
  }, []);

  const getOrder = useCallback((orderId) => {
    return adminOrders.find((o) => o.id === Number(orderId)) || null;
  }, [adminOrders]);

  const advanceOrderStatus = useCallback((orderId, targetStatus) => {
    setAdminOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: targetStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
    setCurrentOrder((prev) =>
      prev && prev.id === orderId
        ? { ...prev, status: targetStatus, updatedAt: new Date().toISOString() }
        : prev
    );
  }, []);

  const cancelOrder = useCallback((orderId) => {
    setAdminOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: 'CANCELLED', updatedAt: new Date().toISOString() }
          : order
      )
    );
    setCurrentOrder((prev) =>
      prev && prev.id === orderId
        ? { ...prev, status: 'CANCELLED', updatedAt: new Date().toISOString() }
        : prev
    );
  }, []);

  const lastOrderId = localStorage.getItem(LAST_ORDER_KEY);

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        setCurrentOrder,
        adminOrders,
        setAdminOrders,
        createOrder,
        getOrder,
        advanceOrderStatus,
        cancelOrder,
        lastOrderId,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
