const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Using callback style for connection test
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection error:", err.message);
        return;
    }
    console.log("Database connected successfully!");
    connection.release();
});


module.exports = pool.promise();
