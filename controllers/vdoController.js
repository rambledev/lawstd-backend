const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const createError = require('../middlewares/errorHandler').createError;

// ดึงวิดีโอทั้งหมดตามรหัสวิชา
const getVdosBySubjectCode = async (req, res, next) => {
  const { sub_code } = req.params;

  try {
    const query = 'SELECT * FROM tb_vdo WHERE sub_code = ?';
    const vdos = await db.query(query, {
      replacements: [sub_code],
      type: QueryTypes.SELECT,
    });

    res.json(vdos);
  } catch (err) {
    next(err);
  }
};

// เพิ่มวิดีโอใหม่
const addVdo = async (req, res, next) => {
  const { sub_code, vdo_name, vdo_link } = req.body;

  try {
    const query = `
      INSERT INTO tb_vdo (sub_code, vdo_name, vdo_link)
      VALUES (?, ?, ?)
    `;
    await db.query(query, {
      replacements: [sub_code, vdo_name, vdo_link],
      type: QueryTypes.INSERT,
    });

    res.status(201).json({ message: 'Vdo created successfully' });
  } catch (err) {
    next(err);
  }
};

// ลบวิดีโอ
const deleteVdo = async (req, res, next) => {
  const { vdo_id } = req.params;

  try {
    const query = 'DELETE FROM tb_vdo WHERE vdo_id = ?';
    const result = await db.query(query, {
      replacements: [vdo_id],
      type: QueryTypes.DELETE,
    });

    if (result[0] === 0) {
      throw createError(404, 'Vdo not found');
    }

    res.json({ message: 'Vdo deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVdosBySubjectCode, addVdo, deleteVdo };