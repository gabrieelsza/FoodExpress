import { initDatabase } from './connection.js';
import { seedDatabase } from './seed.js';

initDatabase();
seedDatabase({ forceResetOrders: true });
console.log('✅ Banco SQLite do FoodExpress inicializado e populado com sucesso!');
