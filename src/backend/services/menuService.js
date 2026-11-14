import { AppError } from '../middlewares/errorHandler.js';
import { categoryRepo } from '../repositories/categoryRepo.js';
import { productRepo } from '../repositories/productRepo.js';

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

function validateCategoryInput({ name }, isUpdate = false) {
  if (!isUpdate || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new AppError(
        'O nome da categoria é obrigatório (RN-001).',
        422,
        'VALIDATION_ERROR'
      );
    }
  }
}

function validateProductInput(
  { categoryId, name, basePrice, variations, addons },
  isUpdate = false
) {
  if (!isUpdate || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new AppError(
        'O nome do produto é obrigatório (RN-001).',
        422,
        'VALIDATION_ERROR'
      );
    }
  }

  if (!isUpdate || basePrice !== undefined) {
    const numPrice = Number(basePrice);
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      throw new AppError(
        'O preço base do produto deve ser numérico e maior que zero (RN-001).',
        422,
        'VALIDATION_ERROR'
      );
    }
  }

  if (!isUpdate || categoryId !== undefined) {
    const cat = categoryRepo.findById(categoryId);
    if (!cat) {
      throw new AppError(
        'A categoria informada para o produto não existe.',
        422,
        'CATEGORY_NOT_FOUND'
      );
    }
  }

  if (Array.isArray(variations)) {
    for (const v of variations) {
      if (!v.name || typeof v.name !== 'string' || v.name.trim().length === 0) {
        throw new AppError(
          'Toda variação deve possuir um nome válido (RN-011).',
          422,
          'VALIDATION_ERROR'
        );
      }
      const vPrice = Number(v.price);
      if (!Number.isFinite(vPrice) || vPrice <= 0) {
        throw new AppError(
          'O preço de cada variação deve ser maior que zero (RN-011).',
          422,
          'VALIDATION_ERROR'
        );
      }
    }
  }

  if (Array.isArray(addons)) {
    for (const a of addons) {
      if (!a.name || typeof a.name !== 'string' || a.name.trim().length === 0) {
        throw new AppError(
          'Todo adicional deve possuir um nome válido (RN-011).',
          422,
          'VALIDATION_ERROR'
        );
      }
      const aPrice = Number(a.price);
      if (!Number.isFinite(aPrice) || aPrice < 0) {
        throw new AppError(
          'O preço de cada adicional não pode ser negativo (RN-011).',
          422,
          'VALIDATION_ERROR'
        );
      }
    }
  }
}

export const menuService = {
  /**
   * API-006 / TR-001 / RN-010: Retorna todas as categorias e produtos (ativos e inativos) para o Admin
   */
  getAdminMenu() {
    const rawCategories = categoryRepo.findAll({ onlyActive: false });
    const products = productRepo.findAll({ onlyActive: false });
    const categories = rawCategories.map((cat) => ({
      ...cat,
      products: products.filter((p) => p.categoryId === cat.id),
    }));
    return { categories, products };
  },

  /**
   * API-002 / TR-002 / RN-001: Retorna apenas categorias ativas contendo produtos ativos
   */
  getPublicMenu() {
    const activeCategories = categoryRepo.findAll({ onlyActive: true });
    const activeProducts = productRepo.findAll({ onlyActive: true });

    const categoriesWithProducts = activeCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      displayOrder: cat.displayOrder,
      products: activeProducts.filter((p) => p.categoryId === cat.id),
    }));

    return { categories: categoriesWithProducts };
  },

  /**
   * API-007 / TR-001: Criação administrativa de categoria
   */
  createCategory(payload) {
    validateCategoryInput(payload, false);
    return categoryRepo.create({
      name: payload.name.trim(),
      displayOrder: payload.displayOrder ?? 0,
      active: payload.active !== undefined ? Boolean(payload.active) : true,
    });
  },

  /**
   * API-007 / TR-001: Atualização administrativa de categoria
   */
  updateCategory(id, payload) {
    const existing = categoryRepo.findById(id);
    if (!existing) {
      throw new AppError('Categoria não encontrada.', 404, 'NOT_FOUND');
    }
    validateCategoryInput(payload, true);
    return categoryRepo.update(id, {
      name: payload.name !== undefined ? payload.name.trim() : undefined,
      displayOrder: payload.displayOrder,
      active: payload.active,
    });
  },

  /**
   * API-008 / TR-001 / TR-012: Criação administrativa de produto com variações e adicionais
   */
  createProduct(payload) {
    validateProductInput(payload, false);
    return productRepo.create({
      categoryId: Number(payload.categoryId),
      name: payload.name.trim(),
      description: (payload.description || '').trim(),
      basePrice: roundMoney(payload.basePrice),
      imageUrl: (payload.imageUrl || '').trim(),
      active: payload.active !== undefined ? Boolean(payload.active) : true,
      variations: (payload.variations || []).map((v) => ({
        name: v.name.trim(),
        price: roundMoney(v.price),
        active: v.active !== undefined ? Boolean(v.active) : true,
      })),
      addons: (payload.addons || []).map((a) => ({
        name: a.name.trim(),
        price: roundMoney(a.price),
        active: a.active !== undefined ? Boolean(a.active) : true,
      })),
    });
  },

  /**
   * API-008 / TR-001 / TR-012: Atualização administrativa de produto
   */
  updateProduct(id, payload) {
    const existing = productRepo.findById(id);
    if (!existing) {
      throw new AppError('Produto não encontrado.', 404, 'NOT_FOUND');
    }
    validateProductInput(payload, true);

    return productRepo.update(id, {
      categoryId: payload.categoryId,
      name: payload.name !== undefined ? payload.name.trim() : undefined,
      description:
        payload.description !== undefined
          ? payload.description.trim()
          : undefined,
      basePrice:
        payload.basePrice !== undefined
          ? roundMoney(payload.basePrice)
          : undefined,
      imageUrl:
        payload.imageUrl !== undefined ? payload.imageUrl.trim() : undefined,
      active: payload.active,
      variations: Array.isArray(payload.variations)
        ? payload.variations.map((v) => ({
            name: v.name.trim(),
            price: roundMoney(v.price),
            active: v.active !== undefined ? Boolean(v.active) : true,
          }))
        : undefined,
      addons: Array.isArray(payload.addons)
        ? payload.addons.map((a) => ({
            name: a.name.trim(),
            price: roundMoney(a.price),
            active: a.active !== undefined ? Boolean(a.active) : true,
          }))
        : undefined,
    });
  },

  /**
   * API-008 / TR-001 / RN-001: Ativação/Inativação rápida de produto
   */
  toggleProductActive(id, explicitActive = undefined) {
    const updated = productRepo.toggleActive(id, explicitActive);
    if (!updated) {
      throw new AppError('Produto não encontrado.', 404, 'NOT_FOUND');
    }
    return updated;
  },

  /**
   * Exclusão administrativa de produto
   */
  deleteProduct(id) {
    const deleted = productRepo.delete(id);
    if (!deleted) {
      throw new AppError('Produto não encontrado.', 404, 'NOT_FOUND');
    }
    return { deleted: true };
  },
};
