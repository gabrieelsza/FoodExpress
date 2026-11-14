import { resetDemoOrders } from '../db/seed.js';
import { orderService } from '../services/orderService.js';

export const orderController = {
  /**
   * API-009: GET /api/admin/orders
   */
  listAdminOrders(req, res, next) {
    try {
      const status = req.query.status ? String(req.query.status) : null;
      const result = orderService.listAdminOrders({ status });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * API-010: PATCH /api/admin/orders/:id/advance
   */
  advanceOrderByAdmin(req, res, next) {
    try {
      const targetStatus = req.body?.targetStatus || null;
      const result = orderService.advanceOrderByAdmin(
        req.params.id,
        targetStatus
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * API-011: POST /api/admin/orders/:id/cancel
   */
  cancelOrderByAdmin(req, res, next) {
    try {
      const result = orderService.cancelOrderByAdmin(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Rota auxiliar do protótipo: POST /api/admin/orders/simulate
   */
  simulateIncomingOrder(_req, res, next) {
    try {
      const result = orderService.simulateIncomingOrder();
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Rota auxiliar do protótipo: POST /api/admin/orders/reset
   */
  resetDemoOrders(_req, res, next) {
    try {
      const orders = resetDemoOrders();
      res.status(200).json({
        orders,
        serverTime: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  },
};
