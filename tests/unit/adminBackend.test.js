import { describe, expect, it } from 'vitest';
import {
  generateAdminToken,
  hashPassword,
  verifyAdminToken,
  verifyPassword,
} from '../../src/backend/services/authService.js';
import { NEXT_STATUS_MAP, ORDER_STATUS } from '../../src/backend/services/orderService.js';

describe('Unit — Segurança (scrypt + JWT) e Máquina de Estados Admin', () => {
  it('RNF-002 / TR-006: deve gerar hash scrypt irreversível com salt aleatório e validar senha corretamente', () => {
    const plain = 'admin123';
    const hash1 = hashPassword(plain);
    const hash2 = hashPassword(plain);

    expect(hash1).not.toBe(plain);
    expect(hash1).toContain(':');
    expect(hash1).not.toBe(hash2); // salts distintos
    expect(verifyPassword(plain, hash1)).toBe(true);
    expect(verifyPassword('senha-errada', hash1)).toBe(false);
  });

  it('RN-010 / TR-006: deve assinar e verificar token JWT administrativo (HMAC-SHA256)', () => {
    const token = generateAdminToken({
      id: 1,
      username: 'admin',
      role: 'ADMIN',
    });

    const payload = verifyAdminToken(token);
    expect(payload.sub).toBe(1);
    expect(payload.username).toBe('admin');
    expect(payload.role).toBe('ADMIN');
  });

  it('RN-006 / TR-009: mapa de transição linear deve seguir estritamente RECEIVED -> PREPARING -> READY -> DELIVERED', () => {
    expect(NEXT_STATUS_MAP[ORDER_STATUS.RECEIVED]).toBe(ORDER_STATUS.PREPARING);
    expect(NEXT_STATUS_MAP[ORDER_STATUS.PREPARING]).toBe(ORDER_STATUS.READY);
    expect(NEXT_STATUS_MAP[ORDER_STATUS.READY]).toBe(ORDER_STATUS.DELIVERED);
    expect(NEXT_STATUS_MAP[ORDER_STATUS.DELIVERED]).toBeNull();
    expect(NEXT_STATUS_MAP[ORDER_STATUS.CANCELLED]).toBeNull();
  });
});
