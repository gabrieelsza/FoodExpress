import { verifyAdminToken } from '../services/authService.js';
import { AppError } from './errorHandler.js';

/**
 * RN-010 / RF-007 / TR-006: Protege todas as rotas administrativas (/api/admin/*)
 */
export function authMiddleware(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Acesso restrito: credenciais de atendente obrigatórias (RN-010).',
        401,
        'UNAUTHORIZED'
      );
    }

    const token = authHeader.slice('Bearer '.length).trim();
    const decoded = verifyAdminToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}
