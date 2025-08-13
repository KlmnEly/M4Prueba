import "dotenv/config";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

export default pool;

// async function databaseConnection() {
//     let connection;
//     try {
//         await pool.getConnection();
//         console.log('conexion exitosa');
//     } catch (error) {
//         console.error('error de conexion: ', error);
//     } finally {
//         if(connection) connection.release();
//     }
// }

// databaseConnection();