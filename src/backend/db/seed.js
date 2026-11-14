import { env } from '../config/env.js';
import { categoryRepo } from '../repositories/categoryRepo.js';
import { orderRepo } from '../repositories/orderRepo.js';
import { productRepo } from '../repositories/productRepo.js';
import { userRepo } from '../repositories/userRepo.js';
import { hashPassword } from '../services/authService.js';
import { getSqlite } from './connection.js';

const minutesAgo = (mins) =>
  new Date(Date.now() - mins * 60 * 1000).toISOString();

export const INITIAL_SEED_ORDERS = () => [
  {
    order: {
      id: 101,
      orderType: 'DINE_IN',
      status: 'RECEIVED',
      tableNumber: '12',
      customerName: null,
      deliveryAddress: null,
      totalAmount: 68.9,
      createdAt: minutesAgo(2),
      updatedAt: minutesAgo(2),
    },
    items: [
      {
        productNameSnapshot: 'X-Burger Artesanal',
        quantity: 2,
        variationNameSnapshot: 'Duplo (2x 160g)',
        addonsSnapshot: [
          { name: 'Bacon Extra', price: 5.0 },
          { name: 'Cheddar Inglês', price: 4.5 },
        ],
        notes: 'Sem cebola em um deles, maionese verde à parte',
        unitPrice: 30.5,
        subtotal: 61.0,
      },
      {
        productNameSnapshot: 'Refrigerante Lata',
        quantity: 1,
        variationNameSnapshot: 'Coca-Cola Zero 350ml',
        addonsSnapshot: [],
        notes: 'Com gelo e limão',
        unitPrice: 7.9,
        subtotal: 7.9,
      },
    ],
  },
  {
    order: {
      id: 102,
      orderType: 'DELIVERY',
      status: 'RECEIVED',
      tableNumber: null,
      customerName: 'Mariana Costa',
      deliveryAddress: 'Rua das Palmeiras, 450 - Apto 32 (Bloco B)',
      totalAmount: 54.0,
      createdAt: minutesAgo(6),
      updatedAt: minutesAgo(6),
    },
    items: [
      {
        productNameSnapshot: 'Smash Crispy Bacon',
        quantity: 1,
        variationNameSnapshot: 'Triplo Smash',
        addonsSnapshot: [{ name: 'Queijo Prato Extra', price: 4.0 }],
        notes: 'Bem passado, por favor',
        unitPrice: 38.0,
        subtotal: 38.0,
      },
      {
        productNameSnapshot: 'Batata Frita Rústica',
        quantity: 1,
        variationNameSnapshot: 'Média (300g)',
        addonsSnapshot: [{ name: 'Alecrim e Páprica', price: 2.0 }],
        notes: '',
        unitPrice: 16.0,
        subtotal: 16.0,
      },
    ],
  },
  {
    order: {
      id: 103,
      orderType: 'DINE_IN',
      status: 'PREPARING',
      tableNumber: '04',
      customerName: null,
      deliveryAddress: null,
      totalAmount: 42.5,
      createdAt: minutesAgo(14),
      updatedAt: minutesAgo(9),
    },
    items: [
      {
        productNameSnapshot: 'Combo Frango Crocante',
        quantity: 1,
        variationNameSnapshot: 'Tradicional',
        addonsSnapshot: [{ name: 'Molho Honey Mustard', price: 3.5 }],
        notes: 'Pouco sal na batata',
        unitPrice: 42.5,
        subtotal: 42.5,
      },
    ],
  },
  {
    order: {
      id: 104,
      orderType: 'DELIVERY',
      status: 'READY',
      tableNumber: null,
      customerName: 'Carlos Eduardo',
      deliveryAddress: 'Av. Brasil, 1200 - Portaria Principal',
      totalAmount: 89.8,
      createdAt: minutesAgo(25),
      updatedAt: minutesAgo(3),
    },
    items: [
      {
        productNameSnapshot: 'X-Salada Clássico',
        quantity: 2,
        variationNameSnapshot: 'Padrão 180g',
        addonsSnapshot: [{ name: 'Ovo Caipira', price: 3.0 }],
        notes: 'Ponto para mal passado',
        unitPrice: 34.9,
        subtotal: 69.8,
      },
      {
        productNameSnapshot: 'Suco Natural',
        quantity: 2,
        variationNameSnapshot: 'Laranja 500ml',
        addonsSnapshot: [],
        notes: 'Sem açúcar',
        unitPrice: 10.0,
        subtotal: 20.0,
      },
    ],
  },
  {
    order: {
      id: 105,
      orderType: 'DINE_IN',
      status: 'DELIVERED',
      tableNumber: '08',
      customerName: null,
      deliveryAddress: null,
      totalAmount: 31.0,
      createdAt: minutesAgo(42),
      updatedAt: minutesAgo(18),
    },
    items: [
      {
        productNameSnapshot: 'Classic Cheeseburger',
        quantity: 1,
        variationNameSnapshot: 'Simples',
        addonsSnapshot: [],
        notes: '',
        unitPrice: 31.0,
        subtotal: 31.0,
      },
    ],
  },
];

export function seedDatabase({ forceResetOrders = false } = {}) {
  // 1. Operador Padrão (RN-010 / RNF-002)
  const existingAdmin = userRepo.findByUsername(env.ADMIN_DEFAULT_USER);
  if (!existingAdmin) {
    userRepo.create({
      username: env.ADMIN_DEFAULT_USER,
      passwordHash: hashPassword(env.ADMIN_DEFAULT_PASS),
      role: 'ADMIN',
    });
  }

  // 2. Categorias e Produtos Iniciais (RN-001 / RN-011)
  const existingCategories = categoryRepo.findAll();
  if (existingCategories.length === 0) {
    const catBurgers = categoryRepo.create({
      name: 'Lanches',
      displayOrder: 1,
      active: true,
    });
    const catSides = categoryRepo.create({
      name: 'Porções',
      displayOrder: 2,
      active: true,
    });
    const catDrinks = categoryRepo.create({
      name: 'Bebidas',
      displayOrder: 3,
      active: true,
    });
    const catDesserts = categoryRepo.create({
      name: 'Sobremesas',
      displayOrder: 4,
      active: true,
    });

    productRepo.create({
      categoryId: catBurgers.id,
      name: 'X-Burger Artesanal',
      description:
        'Pão brioche, hambúrguer 180g, queijo cheddar, alface, tomate e molho especial.',
      basePrice: 28.9,
      imageUrl:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      active: true,
      variations: [
        { name: 'Simples', price: 28.9, active: true },
        { name: 'Duplo', price: 36.9, active: true },
        { name: 'Triplo', price: 44.9, active: true },
      ],
      addons: [
        { name: 'Bacon Extra', price: 5.0, active: true },
        { name: 'Cheddar Extra', price: 4.0, active: true },
        { name: 'Ovo', price: 3.0, active: true },
        { name: 'Onion Rings', price: 6.0, active: true },
      ],
    });

    productRepo.create({
      categoryId: catBurgers.id,
      name: 'X-Salada',
      description:
        'Pão tradicional, hambúrguer 150g, queijo, alface, tomate, cebola e maionese.',
      basePrice: 22.9,
      imageUrl:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
      active: true,
      variations: [
        { name: 'Simples', price: 22.9, active: true },
        { name: 'Duplo', price: 30.9, active: true },
      ],
      addons: [
        { name: 'Bacon Extra', price: 5.0, active: true },
        { name: 'Queijo Extra', price: 3.5, active: true },
      ],
    });

    productRepo.create({
      categoryId: catBurgers.id,
      name: 'Sanduíche Sazonal Trufado (Inativo)',
      description:
        'Edição limitada indisponível no momento para demonstrar ocultação no cardápio público (RN-001).',
      basePrice: 44.0,
      imageUrl:
        'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
      active: false,
      variations: [],
      addons: [],
    });

    productRepo.create({
      categoryId: catSides.id,
      name: 'Batata Frita',
      description:
        'Porção generosa de batatas fritas crocantes com sal e temperos.',
      basePrice: 18.9,
      imageUrl:
        'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
      active: true,
      variations: [
        { name: 'Pequena', price: 14.9, active: true },
        { name: 'Média', price: 18.9, active: true },
        { name: 'Grande', price: 24.9, active: true },
      ],
      addons: [
        { name: 'Cheddar', price: 5.0, active: true },
        { name: 'Bacon', price: 6.0, active: true },
      ],
    });

    productRepo.create({
      categoryId: catDrinks.id,
      name: 'Refrigerante Lata',
      description:
        'Coca-Cola, Guaraná Antarctica, Fanta ou Sprite. Servido bem gelado.',
      basePrice: 7.9,
      imageUrl:
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=450&fit=crop',
      active: true,
      variations: [
        { name: 'Lata 350ml', price: 7.9, active: true },
        { name: '600ml', price: 9.9, active: true },
        { name: '2L', price: 13.9, active: true },
      ],
      addons: [],
    });

    productRepo.create({
      categoryId: catDesserts.id,
      name: 'Thunder Brownie com Sorvete',
      description:
        'Brownie morno de chocolate belga denso com calda quente cremosa e bola generosa de sorvete de baunilha.',
      basePrice: 19.9,
      imageUrl:
        'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=450&fit=crop',
      active: true,
      variations: [],
      addons: [
        { name: 'Bola Extra de Sorvete', price: 5.0, active: true },
        { name: 'Calda Extra de Chocolate', price: 3.0, active: true },
      ],
    });
  }

  // 3. Pedidos Operacionais de Demonstração (#101 a #105)
  const sqlite = getSqlite();
  if (forceResetOrders) {
    sqlite.exec('DELETE FROM order_items; DELETE FROM orders;');
  }

  const existingOrders = orderRepo.findAll();
  if (existingOrders.length === 0) {
    for (const entry of INITIAL_SEED_ORDERS()) {
      orderRepo.createWithItems(entry.order, entry.items);
    }
  }
}

export function resetDemoOrders() {
  seedDatabase({ forceResetOrders: true });
  return orderRepo.findAll();
}
