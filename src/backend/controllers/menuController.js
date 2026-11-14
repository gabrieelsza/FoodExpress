import { menuService } from '../services/menuService.js';

export const menuController = {
  /**
   * API-002: GET /api/public/menu
   */
  getPublicMenu(_req, res, next) {
    try {
      const result = menuService.getPublicMenu();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * API-006: GET /api/admin/menu
   */
  getAdminMenu(_req, res, next) {
    try {
      const result = menuService.getAdminMenu();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * API-007: POST /api/admin/categories
   */
  createCategory(req, res, next) {
    try {
      const category = menuService.createCategory(req.body || {});
      res.status(201).json({ category });
    } catch (err) {
      next(err);
    }
  },

  /**
   * API-007: PUT /api/admin/categories/:id
   */
  updateCategory(req, res, next) {
    try {
      const category = menuService.updateCategory(req.params.id, req.body || {});
      res.status(200).json({ category });
    } catch (err) {
      next(err);
    }
  },

  /**
   * API-008: POST /api/admin/products
   */
  createProduct(req, res, next) {
    try {
      const product = menuService.createProduct(req.body || {});
      res.status(201).json({ product });
    } catch (err) {
      next(err);
    }
  },

  /**
   * API-008: PUT /api/admin/products/:id
   */
  updateProduct(req, res, next) {
    try {
      const product = menuService.updateProduct(req.params.id, req.body || {});
      res.status(200).json({ product });
    } catch (err) {
      next(err);
    }
  },

  /**
   * API-008: PATCH /api/admin/products/:id/toggle
   */
  toggleProductActive(req, res, next) {
    try {
      const explicitActive =
        req.body && req.body.active !== undefined ? req.body.active : undefined;
      const product = menuService.toggleProductActive(
        req.params.id,
        explicitActive
      );
      res.status(200).json({ product });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/admin/products/:id
   */
  deleteProduct(req, res, next) {
    try {
      const result = menuService.deleteProduct(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
