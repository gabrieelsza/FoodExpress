export class AppError extends Error {
  constructor(message, statusCode = 400, code = 'BAD_REQUEST') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message =
    err instanceof AppError
      ? err.message
      : err?.message || 'Erro interno no servidor FoodExpress.';

  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
}
