require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const dbConfig = {
  user: process.env.SUPABASE_DB_USER || 'postgres',
  host: process.env.SUPABASE_DB_HOST,
  database: process.env.SUPABASE_DB_NAME || 'postgres',
  password: process.env.DATABASE_PASSWORD,
  port: process.env.SUPABASE_DB_PORT || 5432,
  ssl: { rejectUnauthorized: false } // Required for Supabase
};

console.log('Connecting to database...');
console.log(`Host: ${dbConfig.host}`);

const client = new Client(dbConfig);

async function updateDb() {
  try {
    await client.connect();
    console.log('Connected successfully.');

    const sqlPath = path.join(__dirname, 'db_update.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running db_update.sql...');
    await client.query(sql);
    
    console.log('Database updated successfully!');
  } catch (err) {
    console.error('Error updating database:', err);
  } finally {
    await client.end();
  }
}

updateDb();
