const bcrypt = require('bcrypt');
const db = require('../config/db');
const { QueryTypes } = require('sequelize');

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM tb_user WHERE username = ?';
    const results = await db.query(query, {
      replacements: [username],
      type: QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Username is incorrect' });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    res.cookie('adminId', admin.id, { sameSite: 'None', secure: true });
    res.json({ message: 'Login successful', adminId: admin.id });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { loginAdmin };