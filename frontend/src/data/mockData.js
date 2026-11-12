// Mock data for development without backend
export const MOCK_MENU = {
  categories: [
    {
      id: 1,
      name: 'Lanches',
      displayOrder: 1,
      active: true,
      products: [
        {
          id: 1,
          name: 'X-Burger Artesanal',
          description: 'Pão brioche, hambúrguer 180g, queijo cheddar, alface, tomate e molho especial.',
          basePrice: 28.90,
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
          active: true,
          variations: [
            { id: 1, name: 'Simples', price: 28.90, active: true },
            { id: 2, name: 'Duplo', price: 36.90, active: true },
            { id: 3, name: 'Triplo', price: 44.90, active: true },
          ],
          addons: [
            { id: 1, name: 'Bacon Extra', price: 5.00, active: true },
            { id: 2, name: 'Cheddar Extra', price: 4.00, active: true },
            { id: 3, name: 'Ovo', price: 3.00, active: true },
            { id: 4, name: 'Onion Rings', price: 6.00, active: true },
          ],
        },
        {
          id: 2,
          name: 'X-Salada',
          description: 'Pão tradicional, hambúrguer 150g, queijo, alface, tomate, cebola e maionese.',
          basePrice: 22.90,
          imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
          active: true,
          variations: [
            { id: 4, name: 'Simples', price: 22.90, active: true },
            { id: 5, name: 'Duplo', price: 30.90, active: true },
          ],
          addons: [
            { id: 5, name: 'Bacon Extra', price: 5.00, active: true },
            { id: 6, name: 'Queijo Extra', price: 3.50, active: true },
          ],
        },
        {
          id: 3,
          name: 'Frango Crispy',
          description: 'Pão com gergelim, filé de frango empanado, alface, maionese temperada.',
          basePrice: 25.90,
          imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop',
          active: true,
          variations: [],
          addons: [
            { id: 7, name: 'Cheddar', price: 4.00, active: true },
            { id: 8, name: 'Bacon', price: 5.00, active: true },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Porções',
      displayOrder: 2,
      active: true,
      products: [
        {
          id: 4,
          name: 'Batata Frita',
          description: 'Porção generosa de batatas fritas crocantes com sal e temperos.',
          basePrice: 18.90,
          imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
          active: true,
          variations: [
            { id: 6, name: 'Pequena', price: 14.90, active: true },
            { id: 7, name: 'Média', price: 18.90, active: true },
            { id: 8, name: 'Grande', price: 24.90, active: true },
          ],
          addons: [
            { id: 9, name: 'Cheddar', price: 5.00, active: true },
            { id: 10, name: 'Bacon', price: 6.00, active: true },
          ],
        },
        {
          id: 5,
          name: 'Nuggets (10 un)',
          description: '10 unidades de nuggets crocantes de frango com molho barbecue.',
          basePrice: 19.90,
          imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
          active: true,
          variations: [],
          addons: [
            { id: 11, name: 'Molho Extra', price: 2.00, active: true },
          ],
        },
        {
          id: 6,
          name: 'Onion Rings',
          description: 'Anéis de cebola empanados e crocantes com molho ranch.',
          basePrice: 16.90,
          imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop',
          active: true,
          variations: [],
          addons: [],
        },
      ],
    },
    {
      id: 3,
      name: 'Bebidas',
      displayOrder: 3,
      active: true,
      products: [
        {
          id: 7,
          name: 'Refrigerante Lata',
          description: 'Coca-Cola, Guaraná Antarctica, Fanta ou Sprite. Servido bem gelado.',
          basePrice: 7.90,
          imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=450&fit=crop',
          active: true,
          variations: [
            { id: 9, name: 'Lata 350ml', price: 7.90, active: true },
            { id: 10, name: '600ml', price: 9.90, active: true },
            { id: 11, name: '2L', price: 13.90, active: true },
          ],
          addons: [],
        },
        {
          id: 12,
          name: 'Chopp Artesanal Caneca Congelada',
          description: 'Chopp pilsen puro malte artesanal tirado no padrão perfeito e servido na caneca ultracongelada com colarinho cremoso.',
          basePrice: 11.90,
          imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&h=450&fit=crop',
          active: true,
          variations: [
            { id: 16, name: 'Caneca 340ml', price: 11.90, active: true },
            { id: 17, name: 'Canecão 500ml', price: 16.90, active: true },
          ],
          addons: [],
        },
        {
          id: 8,
          name: 'Suco Natural',
          description: 'Laranja, limão, maracujá ou abacaxi. Feito na hora com frutas frescas.',
          basePrice: 10.90,
          imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&h=450&fit=crop',
          active: true,
          variations: [
            { id: 12, name: '300ml', price: 10.90, active: true },
            { id: 13, name: '500ml', price: 14.90, active: true },
          ],
          addons: [],
        },
        {
          id: 9,
          name: 'Água Mineral',
          description: 'Água mineral sem gás ou com gás 500ml.',
          basePrice: 4.90,
          imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=450&fit=crop',
          active: true,
          variations: [],
          addons: [],
        },
      ],
    },
    {
      id: 4,
      name: 'Sobremesas',
      displayOrder: 4,
      active: true,
      products: [
        {
          id: 11,
          name: 'Thunder Brownie com Sorvete',
          description: 'Brownie morno de chocolate belga denso com calda quente cremosa e bola generosa de sorvete de baunilha.',
          basePrice: 19.90,
          imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=450&fit=crop',
          active: true,
          variations: [],
          addons: [
            { id: 14, name: 'Bola Extra de Sorvete', price: 5.00, active: true },
            { id: 15, name: 'Calda Extra de Chocolate', price: 3.00, active: true },
          ],
        },
        {
          id: 13,
          name: 'Pudim Artesanal de Leite',
          description: 'Pudim tradicional de leite condensado super cremoso e lisinho com calda de caramelo brilhante.',
          basePrice: 12.90,
          imageUrl: 'https://images.unsplash.com/photo-1532556660262-1c45d5fae825?w=600&h=450&fit=crop',
          active: true,
          variations: [],
          addons: [],
        },
        {
          id: 10,
          name: 'Milkshake',
          description: 'Milkshake cremoso. Sabores: Chocolate Belga, Morango Silvestre ou Ovomaltine Crocante.',
          basePrice: 16.90,
          imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=450&fit=crop',
          active: true,
          variations: [
            { id: 14, name: '300ml', price: 16.90, active: true },
            { id: 15, name: '500ml', price: 22.90, active: true },
          ],
          addons: [
            { id: 12, name: 'Chantilly', price: 3.00, active: true },
            { id: 13, name: 'Calda Extra', price: 2.50, active: true },
          ],
        },
      ],
    },
  ],
};

// Restaurant configuration
export const RESTAURANT_CONFIG = {
  name: 'FoodExpress',
  whatsappNumber: '5511999999999',
  defaultPollingIntervalMs: 300000, // 5 minutes
};

// Order status configuration
export const ORDER_STATUS = {
  RECEIVED: { label: 'Recebido', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50', step: 1 },
  PREPARING: { label: 'Em preparo', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50', step: 2 },
  READY: { label: 'Pronto', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50', step: 3 },
  DELIVERED: { label: 'Entregue', color: 'bg-gray-500', textColor: 'text-gray-700', bgLight: 'bg-gray-50', step: 4 },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', step: -1 },
};

export const ORDER_STATUS_SEQUENCE = ['RECEIVED', 'PREPARING', 'READY', 'DELIVERED'];

// Mock orders for admin panel development
export const MOCK_ORDERS = [
  {
    id: 101,
    orderType: 'DINE_IN',
    status: 'RECEIVED',
    tableNumber: '5',
    customerName: null,
    deliveryAddress: null,
    totalAmount: 72.80,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    items: [
      { id: 1, productNameSnapshot: 'X-Burger Artesanal', quantity: 2, variationNameSnapshot: 'Duplo', addonsJsonSnapshot: JSON.stringify([{ name: 'Bacon Extra', price: 5.00 }]), notes: 'Sem cebola', unitPrice: 41.90, subtotal: 83.80 },
      { id: 2, productNameSnapshot: 'Refrigerante', quantity: 2, variationNameSnapshot: 'Lata 350ml', addonsJsonSnapshot: '[]', notes: '', unitPrice: 7.90, subtotal: 15.80 },
    ],
  },
  {
    id: 102,
    orderType: 'DELIVERY',
    status: 'PREPARING',
    tableNumber: null,
    customerName: 'Maria Silva',
    deliveryAddress: 'Rua das Flores, 123 - Apto 4',
    totalAmount: 54.70,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    items: [
      { id: 3, productNameSnapshot: 'X-Salada', quantity: 1, variationNameSnapshot: 'Simples', addonsJsonSnapshot: '[]', notes: 'Maionese à parte', unitPrice: 22.90, subtotal: 22.90 },
      { id: 4, productNameSnapshot: 'Batata Frita', quantity: 1, variationNameSnapshot: 'Grande', addonsJsonSnapshot: JSON.stringify([{ name: 'Cheddar', price: 5.00 }]), notes: '', unitPrice: 29.90, subtotal: 29.90 },
    ],
  },
  {
    id: 103,
    orderType: 'DINE_IN',
    status: 'READY',
    tableNumber: '12',
    customerName: null,
    deliveryAddress: null,
    totalAmount: 38.70,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    items: [
      { id: 5, productNameSnapshot: 'Frango Crispy', quantity: 1, variationNameSnapshot: null, addonsJsonSnapshot: JSON.stringify([{ name: 'Cheddar', price: 4.00 }]), notes: '', unitPrice: 29.90, subtotal: 29.90 },
      { id: 6, productNameSnapshot: 'Água Mineral', quantity: 1, variationNameSnapshot: null, addonsJsonSnapshot: '[]', notes: '', unitPrice: 4.90, subtotal: 4.90 },
    ],
  },
];
