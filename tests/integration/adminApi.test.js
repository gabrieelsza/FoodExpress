import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../src/backend/app.js';
import { initDatabase } from '../../src/backend/db/connection.js';
import { seedDatabase } from '../../src/backend/db/seed.js';

describe('Integration — Backend Admin API (Auth, Cardápio e Fila de Pedidos)', () => {
  let adminToken = '';

  beforeEach(async () => {
    initDatabase(':memory:');
    seedDatabase({ forceResetOrders: true });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(loginRes.status).toBe(200);
    adminToken = loginRes.body.token;
  });

  it('API-001 / RN-010: deve bloquear acesso a /api/admin/* sem token e recusar login inválido', async () => {
    const unauthOrders = await request(app).get('/api/admin/orders');
    expect(unauthOrders.status).toBe(401);

    const badLogin = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong' });
    expect(badLogin.status).toBe(401);
  });

  it('API-006, API-007, API-008 / RN-001 / RN-011: deve gerenciar categorias e produtos, validando preço > 0 e ocultando inativos no cardápio público', async () => {
    // Admin vê todos os produtos (inclusive o inativo do seed)
    const adminMenuRes = await request(app)
      .get('/api/admin/menu')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminMenuRes.status).toBe(200);
    const hasInactiveInAdmin = adminMenuRes.body.products.some(
      (p) => p.active === false
    );
    expect(hasInactiveInAdmin).toBe(true);

    // Público vê apenas ativos (RN-001)
    const publicMenuRes = await request(app).get('/api/public/menu');
    expect(publicMenuRes.status).toBe(200);
    const allPublicProducts = publicMenuRes.body.categories.flatMap(
      (c) => c.products
    );
    expect(allPublicProducts.every((p) => p.active === true)).toBe(true);

    // Tentativa de cadastrar produto com preço <= 0 deve retornar 422 (RN-001)
    const invalidProdRes = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        name: 'Produto Inválido',
        basePrice: 0,
      });
    expect(invalidProdRes.status).toBe(422);

    // Cadastro válido com variações e adicionais (RF-001 / RF-013)
    const validProdRes = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        name: 'Burger Especial da Casa',
        description: 'Pão australiano e costela',
        basePrice: 32.5,
        active: true,
        variations: [{ name: '200g', price: 32.5 }],
        addons: [{ name: 'Cebola Crispy', price: 4.0 }],
      });
    expect(validProdRes.status).toBe(201);
    expect(validProdRes.body.product.variations).toHaveLength(1);
    expect(validProdRes.body.product.addons).toHaveLength(1);
  });

  it('API-009, API-010 / RN-006: deve avançar status de pedido estritamente na sequência linear e recusar pulos de etapa', async () => {
    // Pedido #101 nasce em RECEIVED no seed
    const skipRes = await request(app)
      .patch('/api/admin/orders/101/advance')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ targetStatus: 'READY' });
    expect(skipRes.status).toBe(422);

    // Avanço válido: RECEIVED -> PREPARING
    const step1 = await request(app)
      .patch('/api/admin/orders/101/advance')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(step1.status).toBe(200);
    expect(step1.body.order.status).toBe('PREPARING');

    // Avanço válido: PREPARING -> READY
    const step2 = await request(app)
      .patch('/api/admin/orders/101/advance')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(step2.status).toBe(200);
    expect(step2.body.order.status).toBe('READY');

    // Avanço válido: READY -> DELIVERED
    const step3 = await request(app)
      .patch('/api/admin/orders/101/advance')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(step3.status).toBe(200);
    expect(step3.body.order.status).toBe('DELIVERED');

    // Tentar avançar após DELIVERED deve retornar 422
    const step4 = await request(app)
      .patch('/api/admin/orders/101/advance')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(step4.status).toBe(422);
  });

  it('API-011 / RN-008: deve permitir ao atendente cancelar qualquer pedido ativo sem justificativa e bloquear se já entregue', async () => {
    // Pedido #103 está em PREPARING -> pode ser cancelado pelo atendente
    const cancelRes = await request(app)
      .post('/api/admin/orders/103/cancel')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.order.status).toBe('CANCELLED');

    // Pedido #105 já está em DELIVERED -> não pode ser cancelado
    const cancelDeliveredRes = await request(app)
      .post('/api/admin/orders/105/cancel')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(cancelDeliveredRes.status).toBe(422);
  });
});
