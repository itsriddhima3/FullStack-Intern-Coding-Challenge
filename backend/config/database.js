import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Shivi3007",
    database:"store_rating_system"
});
console.log("Connected to MySQL database");


// await db.execute(`
//   CREATE TABLE users (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(60) NOT NULL,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   address VARCHAR(400),
//   role ENUM('admin', 'user', 'store_owner') DEFAULT 'user',
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);


// db.execute(`CREATE TABLE stores (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(60) NOT NULL,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   address VARCHAR(400),
//   owner_id INT,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
// )`);

export default db;