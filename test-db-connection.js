const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    
    console.log('Successfully connected to the database');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
    console.log('Test query result:', rows[0]);
    
    await connection.end();
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

testConnection();