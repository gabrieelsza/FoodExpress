import { AppError } from '../middlewares/errorHandler.js';
import { orderRepo } from '../repositories/orderRepo.js';

export const ORDER_STATUS = {
  RECEIVED: 'RECEIVED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

/**
 * RN-006 / TR-009: Mapa estrito da Máquina de Estados Finita (FSM) linear
 * Recebido -> Em preparo -> Pronto -> Entregue
 */
export const NEXT_STATUS_MAP = {
  [ORDER_STATUS.RECEIVED]: ORDER_STATUS.PREPARING,
  [ORDER_STATUS.PREPARING]: ORDER_STATUS.READY,
  [ORDER_STATUS.READY]: ORDER_STATUS.DELIVERED,
  [ORDER_STATUS.DELIVERED]: null,
  [ORDER_STATUS.CANCELLED]: null,
};

const CUSTOMER_CANCEL_WINDOW_MS = 5 * 60 * 1000; // 5 minutos (300.000 ms) - RN-007

export const orderService = {
  /**
   * API-009 / TR-008 / RN-004 / RN-009: Lista pedidos para o Painel do Atendente
   */
  listAdminOrders({ status = null } = {}) {
    const orders = orderRepo.findAll({ status });
    return {
      orders,
      serverTime: new Date().toISOString(),
    };
  },

  /**
   * API-010 / TR-009 / RN-006: Avança linearmente o status do pedido sem permitir pulos ou retrocessos
   */
  advanceOrderByAdmin(orderId, targetStatus = null) {
    const order = orderRepo.findById(orderId);
    if (!order) {
      throw new AppError('Pedido não encontrado.', 404, 'ORDER_NOT_FOUND');
    }

    const expectedNext = NEXT_STATUS_MAP[order.status] ?? null;

    if (!expectedNext) {
      throw new AppError(
        `Transição de status inválida: o pedido #${order.id} já se encontra no estado final "${order.status}" (RN-006).`,
        422,
        'INVALID_STATUS_TRANSITION'
      );
    }

    const desiredStatus = targetStatus || expectedNext;
    if (desiredStatus !== expectedNext) {
      throw new AppError(
        `Transição de status inválida (${order.status} -> ${desiredStatus}): não é permitido pular ou retroceder etapas. Próximo estado obrigatório: ${expectedNext} (RN-006).`,
        422,
        'INVALID_STATUS_TRANSITION'
      );
    }

    const updated = orderRepo.updateStatus(
      order.id,
      expectedNext,
      new Date().toISOString()
    );
    return { order: updated };
  },

  /**
   * API-011 / TR-010 / RN-008: Cancelamento irrestrito pelo atendente para qualquer pedido ativo,
   * sem exigir justificativa. Bloqueia se já estiver DELIVERED ou CANCELLED.
   */
  cancelOrderByAdmin(orderId) {
    const order = orderRepo.findById(orderId);
    if (!order) {
      throw new AppError('Pedido não encontrado.', 404, 'ORDER_NOT_FOUND');
    }

    const activeStatuses = [
      ORDER_STATUS.RECEIVED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.READY,
    ];

    if (!activeStatuses.includes(order.status)) {
      throw new AppError(
        `Não é possível cancelar o pedido #${order.id} pois já está no estado final "${order.status}" (RN-008).`,
        422,
        'ORDER_ALREADY_FINALIZED'
      );
    }

    const updated = orderRepo.updateStatus(
      order.id,
      ORDER_STATUS.CANCELLED,
      new Date().toISOString()
    );
    return { order: updated };
  },

  /**
   * API-005 / TR-010 / RN-007: Cancelamento pelo cliente permitido apenas em até 5 minutos
   * e enquanto o pedido estiver em RECEIVED.
   */
  cancelOrderByCustomer(orderId) {
    const order = orderRepo.findById(orderId);
    if (!order) {
      throw new AppError('Pedido não encontrado.', 404, 'ORDER_NOT_FOUND');
    }

    if (order.status !== ORDER_STATUS.RECEIVED) {
      throw new AppError(
        'O pedido já entrou em preparo ou foi finalizado e não pode ser cancelado pelo cliente (RN-007).',
        422,
        'CANNOT_CANCEL_IN_PROGRESS'
      );
    }

    const elapsedMs = Date.now() - new Date(order.createdAt).getTime();
    if (elapsedMs > CUSTOMER_CANCEL_WINDOW_MS) {
      throw new AppError(
        'Prazo de 5 minutos para cancelamento pelo cliente expirado (RN-007).',
        422,
        'CANCEL_WINDOW_EXPIRED'
      );
    }

    const updated = orderRepo.updateStatus(
      order.id,
      ORDER_STATUS.CANCELLED,
      new Date().toISOString()
    );
    return { order: updated };
  },

  /**
   * Simulador de chegada de novo pedido no banco SQLite para validação do protótipo (RN-004)
   */
  simulateIncomingOrder() {
    const existing = orderRepo.findAll();
    const maxId = existing.reduce((acc, item) => Math.max(acc, item.id), 100);
    const nextId = maxId + 1;
    const isDineIn = nextId % 2 === 0;
    const now = new Date().toISOString();

    if (isDineIn) {
      const tableNum = String(((nextId * 3) % 15) + 1).padStart(2, '0');
      const created = orderRepo.createWithItems(
        {
          id: nextId,
          orderType: 'DINE_IN',
          status: ORDER_STATUS.RECEIVED,
          tableNumber: tableNum,
          customerName: null,
          deliveryAddress: null,
          totalAmount: 47.9,
          createdAt: now,
          updatedAt: now,
        },
        [
          {
            productNameSnapshot: 'Double Cheddar Melt',
            quantity: 1,
            variationNameSnapshot: 'Duplo 160g',
            addonsSnapshot: [{ name: 'Farofa de Bacon', price: 6.0 }],
            notes: 'Sem picles, pão bem selado',
            unitPrice: 39.9,
            subtotal: 39.9,
          },
          {
            productNameSnapshot: 'Água com Gás',
            quantity: 1,
            variationNameSnapshot: '500ml',
            addonsSnapshot: [],
            notes: 'Com rodela de limão',
            unitPrice: 8.0,
            subtotal: 8.0,
          },
        ]
      );
      return { order: created };
    }

    const created = orderRepo.createWithItems(
      {
        id: nextId,
        orderType: 'DELIVERY',
        status: ORDER_STATUS.RECEIVED,
        tableNumber: null,
        customerName: `Cliente #${nextId} (Fernanda Lima)`,
        deliveryAddress: 'Rua Sete de Setembro, 88 - Casa 2',
        totalAmount: 64.5,
        createdAt: now,
        updatedAt: now,
      },
      [
        {
          productNameSnapshot: 'Combo Casal Smash',
          quantity: 1,
          variationNameSnapshot: '2 Burgers + 2 Fritas',
          addonsSnapshot: [{ name: 'Maionese Defumada Extra', price: 4.5 }],
          notes: 'Enviar guardanapos e sachês extras',
          unitPrice: 64.5,
          subtotal: 64.5,
        },
      ]
    );
    return { order: created };
  },
};
