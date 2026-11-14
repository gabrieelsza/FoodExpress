import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { menuController } from '../controllers/menuController.js';
import { orderController } from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const apiRouter = Router();

// Healthcheck da API
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'foodexpress-backend',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// Rotas de Autenticação (API-001)
// ============================================================================
apiRouter.post('/auth/login', authController.login);

// ============================================================================
// Rotas Públicas de Cardápio (API-002)
// ============================================================================
apiRouter.get('/public/menu', menuController.getPublicMenu);

// ============================================================================
// Rotas Administrativas Protegidas por Token JWT (RN-010 / TR-006)
// ============================================================================
apiRouter.use('/admin', authMiddleware);

// Cardápio Admin (API-006, API-007, API-008)
apiRouter.get('/admin/menu', menuController.getAdminMenu);
apiRouter.post('/admin/categories', menuController.createCategory);
apiRouter.put('/admin/categories/:id', menuController.updateCategory);
apiRouter.post('/admin/products', menuController.createProduct);
apiRouter.put('/admin/products/:id', menuController.updateProduct);
apiRouter.patch('/admin/products/:id/toggle', menuController.toggleProductActive);
apiRouter.delete('/admin/products/:id', menuController.deleteProduct);

// Operação de Pedidos Admin (API-009, API-010, API-011)
apiRouter.get('/admin/orders', orderController.listAdminOrders);
apiRouter.post('/admin/orders/simulate', orderController.simulateIncomingOrder);
apiRouter.post('/admin/orders/reset', orderController.resetDemoOrders);
apiRouter.patch('/admin/orders/:id/advance', orderController.advanceOrderByAdmin);
apiRouter.post('/admin/orders/:id/cancel', orderController.cancelOrderByAdmin);
