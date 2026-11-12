import { createContext, useCallback, useContext, useState } from 'react';
import { MOCK_ORDERS } from '../data/mockData';

const OrderContext = createContext(null);

const LAST_ORDER_KEY = 'foodexpress_last_order_id';

export function OrderProvider({ children }) {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [adminOrders, setAdminOrders] = useState(MOCK_ORDERS);

  // Simulated order ID counter
  const [nextId, setNextId] = useState(200);

  const createOrder = useCallback((orderData) => {
    const newOrder = {
      id: nextId,
      ...orderData,
      status: 'RECEIVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNextId((prev) => prev + 1);
    setCurrentOrder(newOrder);
    setAdminOrders((prev) => [newOrder, ...prev]);
    localStorage.setItem(LAST_ORDER_KEY, String(newOrder.id));
    return newOrder;
  }, [nextId]);

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
