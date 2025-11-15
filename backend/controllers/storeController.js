import db from '../config/database.js';

export const getRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [stores] = await db.query(
      'SELECT id FROM stores WHERE owner_id = ?',
      [ownerId]
    );

    if (stores.length === 0) {
      return res.json([]);
    }

    const storeId = stores[0].id;

    const [ratings] = await db.query(
      `SELECT u.name, u.email, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [stores] = await db.query(
      'SELECT id, name FROM stores WHERE owner_id = ?',
      [ownerId]
    );

    if (stores.length === 0) {
      return res.json({ storeName: null, averageRating: 0 });
    }

    const storeId = stores[0].id;

    const [result] = await db.query(
      'SELECT COALESCE(AVG(rating), 0) as averageRating FROM ratings WHERE store_id = ?',
      [storeId]
    );

    res.json({
      storeName: stores[0].name,
      averageRating: parseFloat(result[0].averageRating).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};