import { app } from './app.js';
import { env } from './config/env.js';
import { initDatabase } from './db/connection.js';
import { seedDatabase } from './db/seed.js';

initDatabase();
seedDatabase();

const server = app.listen(env.PORT, '127.0.0.1', () => {
  console.log(
    `🚀 FoodExpress Admin Backend rodando em http://127.0.0.1:${env.PORT}/api`
  );
  console.log(`📦 Banco SQLite inicializado em ${env.DATABASE_URL}`);
});

export default server;
