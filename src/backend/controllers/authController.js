import { AppError } from '../middlewares/errorHandler.js';
import { userRepo } from '../repositories/userRepo.js';
import { generateAdminToken, verifyPassword } from '../services/authService.js';

export const authController = {
  /**
   * API-001 / TR-006 / RF-007 / RN-010: POST /api/auth/login
   */
  login(req, res, next) {
    try {
      const { username, password } = req.body || {};

      if (!username || !password) {
        throw new AppError(
          'Usuário e senha são obrigatórios.',
          400,
          'MISSING_CREDENTIALS'
        );
      }

      const user = userRepo.findByUsername(String(username).trim());
      if (!user || !verifyPassword(String(password), user.passwordHash)) {
        throw new AppError(
          'Credenciais inválidas. Verifique seu usuário e senha.',
          401,
          'INVALID_CREDENTIALS'
        );
      }

      const token = generateAdminToken(user);
      res.status(200).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
