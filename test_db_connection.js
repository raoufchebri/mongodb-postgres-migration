import client from './lib/postgresql.js';

async function testConnection() {
  try {
    console.log('Connected to PostgreSQL database successfully.');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from database:', res.rows[0]);
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  }
}

testConnection();
