const bcrypt = require('bcrypt');
const db = require('../config/db');
const { QueryTypes } = require('sequelize');

// ฟังก์ชันรีเซ็ตรหัสผ่านของ admin
const resetAdminPassword = async (req, res) => {
  const { newPassword } = req.body;
  const username = 'admin';
  const saltRounds = 10;

  try {
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const query = 'UPDATE tb_user SET password = ? WHERE username = ?';
    const result = await db.query(query, {
      replacements: [hashedPassword, username],
      type: QueryTypes.UPDATE,
    });

    // ตรวจสอบค่าที่ส่งกลับ
    if (result[0] && result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ฟังก์ชันล็อกอิน
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const query = 'SELECT * FROM tb_user WHERE username = ?';
    const results = await db.query(query, {
      replacements: [username],
      type: QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid  password' });
    }

    res.cookie('adminId', admin.id, { sameSite: 'None', secure: true });
    res.json({ message: 'Login successful', profile: results });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { resetAdminPassword, loginAdmin };