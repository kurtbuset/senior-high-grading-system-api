const config = require('./config.json');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAdminAccounts() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    
    console.log('Successfully connected to the database');
    
    // Check if there are any accounts with Admin role
    const [rows] = await connection.execute("SELECT * FROM accounts WHERE role = 'Admin'");
    console.log('Accounts with Admin role:', rows);
    
    await connection.end();
  } catch (error) {
    console.error('Database query error:', error);
  }
}

checkAdminAccounts();