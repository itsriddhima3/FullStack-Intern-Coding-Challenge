import bcrypt from 'bcrypt';
import db from '../config/database.js';

export const getDashboard = async (req, res) => {
  try {
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    const [stores] = await db.query('SELECT COUNT(*) as count FROM stores');
    const [ratings] = await db.query('SELECT COUNT(*) as count FROM ratings');

    res.json({
      totalUsers: users[0].count,
      totalStores: stores[0].count,
      totalRatings: ratings[0].count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;
    let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    const params = [];

    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (sortBy) {
      const validColumns = ['name', 'email', 'address', 'role', 'created_at'];
      if (validColumns.includes(sortBy)) {
        query += ` ORDER BY ${sortBy} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
      }
    }

    const [users] = await db.query(query, params);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, sortOrder } = req.query;
    let query = `
      SELECT s.id, s.name, s.email, s.address, 
             COALESCE(AVG(r.rating), 0) as rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY s.id, s.name, s.email, s.address';

    if (sortBy) {
      const validColumns = ['name', 'email', 'address', 'rating'];
      if (validColumns.includes(sortBy)) {
        query += ` ORDER BY ${sortBy} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
      }
    }

    const [stores] = await db.query(query, params);
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query(
      'SELECT id, name, email, address, role FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    if (user.role === 'store_owner') {
      const [stores] = await db.query(
        `SELECT s.id, s.name, COALESCE(AVG(r.rating), 0) as rating
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ?
         GROUP BY s.id, s.name`,
        [id]
      );
      user.stores = stores;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: 'Name must be between 20-60 characters' });
    }
    if (address && address.length > 400) {
      return res.status(400).json({ message: 'Address must be max 400 characters' });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be 8-16 characters with at least one uppercase and one special character' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User created successfully', id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerEmail } = req.body;

    if (name.length < 10 || name.length > 60) {
      return res.status(400).json({ message: 'Name must be between 10-60 characters' });
    }
    if (address && address.length > 400) {
      return res.status(400).json({ message: 'Address must be max 400 characters' });
    }

    let ownerId = null;
    if (ownerEmail) {
      const [owners] = await db.query(
        'SELECT id FROM users WHERE email = ? AND role = ?',
        [ownerEmail, 'store_owner']
      );
      if (owners.length > 0) {
        ownerId = owners[0].id;
      }
    }

    const [result] = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, ownerId]
    );

    res.status(201).json({ message: 'Store created successfully', id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};