import client from '../lib/postgresql.js';

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database successfully.');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from database:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  }
}

testConnection();
