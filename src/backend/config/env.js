import fs from 'node:fs';
import path from 'node:path';

function loadDotEnvFile() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) return;
    const raw = fs.readFileSync(envPath, 'utf-8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // Fallback para variáveis de ambiente padrão
  }
}

loadDotEnvFile();

export const env = {
  PORT: Number(process.env.PORT || 3333),
  DATABASE_URL: process.env.DATABASE_URL || './data/foodexpress.sqlite',
  JWT_SECRET: process.env.JWT_SECRET || 'foodexpress-local-dev-secret-key',
  RESTAURANT_WHATSAPP: process.env.RESTAURANT_WHATSAPP || '5511999999999',
  ADMIN_DEFAULT_USER: process.env.ADMIN_DEFAULT_USER || 'admin',
  ADMIN_DEFAULT_PASS: process.env.ADMIN_DEFAULT_PASS || 'admin123',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
