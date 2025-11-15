import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const hashedPassword = await bcrypt.hash('Admin@1', 10);
    
    await connection.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = ?',
      ['Admin User', 'admin@example.com', hashedPassword, '123 Admin Street', 'admin', hashedPassword]
    );

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@1');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
}

createAdmin();