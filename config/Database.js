// import dotenv from 'dotenv';
// dotenv.config();

// import {Sequelize} from "sequelize";

// const db = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_HOST,
//         dialect: 'mysql',
//     }
// )

// // import {Sequelize} from "sequelize";

// // const db = new Sequelize('auth_db','root','',{
// //     host: "localhost",
// //     dialect: "mysql"
// // });

// export default db;



// // export default db;

import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
if (!process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_NAME || !process.env.INSTANCE_UNIX_SOCKET) {
    throw new Error('Environment variables DB_USER, DB_PASS, DB_NAME, or INSTANCE_UNIX_SOCKET are not set.');
  }

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,  // Menggunakan socketPath untuk Cloud SQL
        dialect: 'mysql',
        dialectOptions: {
            socketPath: process.env.DB_HOST,
        },
    }
);

// Uji koneksi
export async function testConnection() {
    try {
        await db.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
}


export default db;
