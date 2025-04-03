const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'vraj',
    database: process.env.DB_NAME || 'vraj',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// function to initialize the database

const initializeDatabase = async () => {
    try {
        const connection = await pool.getConnection();

        // Create users table if it doesn't exist
        await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          profile_image VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

        console.log('database initialized successfull...');
        connection.release();
    }catch(err){
        console.error('Error initializing database.', err);
        process.exit(1);
    }
};

module.exports = {
    pool,
    initializeDatabase
};