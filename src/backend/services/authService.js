import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { AppError } from '../middlewares/errorHandler.js';

const TOKEN_TTL_SECONDS = 8 * 60 * 60; // 8 horas de turno operacional

function base64UrlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input), 'utf-8');
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input) {
  let str = input.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4 !== 0) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf-8');
}

/**
 * RNF-002 / TR-006: Hash criptográfico irreversível de senha usando node:crypto scrypt
 * Formato armazenado: "<salt_hex>:<derived_key_hex>"
 */
export function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new AppError('A senha é obrigatória.', 400, 'INVALID_PASSWORD');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(plainPassword, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

/**
 * RNF-002 / TR-006: Comparação em tempo constante contra ataques de timing
 */
export function verifyPassword(plainPassword, storedHash) {
  if (!plainPassword || !storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, keyHex] = storedHash.split(':');
  const keyBuffer = Buffer.from(keyHex, 'hex');
  const derivedBuffer = crypto.scryptSync(plainPassword, salt, 64);

  if (keyBuffer.length !== derivedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
}

/**
 * TR-006 / RN-010: Emissão de Token JWT assinado via HMAC-SHA256
 */
export function generateAdminToken(user) {
  const nowSec = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: user.id,
    username: user.username,
    role: user.role || 'ADMIN',
    iat: nowSec,
    exp: nowSec + TOKEN_TTL_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', env.JWT_SECRET)
    .update(signingInput)
    .digest();

  return `${signingInput}.${base64UrlEncode(signature)}`;
}

/**
 * TR-006 / RN-010: Validação de assinatura e expiração do Token JWT
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') {
    throw new AppError('Token de autenticação ausente.', 401, 'UNAUTHORIZED');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new AppError('Formato de token inválido.', 401, 'INVALID_TOKEN');
  }

  const [encodedHeader, encodedPayload, providedSignature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = base64UrlEncode(
    crypto.createHmac('sha256', env.JWT_SECRET).update(signingInput).digest()
  );

  const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
  const providedBuf = Buffer.from(providedSignature, 'utf-8');

  if (
    expectedBuf.length !== providedBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, providedBuf)
  ) {
    throw new AppError('Assinatura de token inválida.', 401, 'INVALID_TOKEN');
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch {
    throw new AppError('Payload do token malformado.', 401, 'INVALID_TOKEN');
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp && nowSec > payload.exp) {
    throw new AppError('Sessão administrativa expirada.', 401, 'TOKEN_EXPIRED');
  }

  return payload;
}
