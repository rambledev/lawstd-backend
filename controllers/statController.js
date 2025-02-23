const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const { createError } = require('../middlewares/errorHandler');

// เก็บยอดวิว
const recordView = async (req, res, next) => {
  const { vdo_id, std_code } = req.body;

  try {
    const query = `
      INSERT INTO tb_vdo_views (vdo_id, std_code, view_time)
      VALUES (?, ?, NOW())
    `;
    await db.query(query, {
      replacements: [vdo_id, std_code],
      type: QueryTypes.INSERT,
    });

    res.status(201).json({ message: 'View recorded successfully' });
  } catch (err) {
    next(err);
  }
};


// ดูยอดรวมของการดูวิดีโอ
const getVdoViewCount = async (req, res, next) => {
  const { vdo_id } = req.params;

  try {
    const query = `
      SELECT COUNT(*) AS view_count 
      FROM tb_vdo_views 
      WHERE vdo_id = ?
    `;
    const result = await db.query(query, {
      replacements: [vdo_id],
      type: QueryTypes.SELECT,
    });

    if (result.length > 0) {
      res.json({ vdo_id, view_count: result[0].view_count });
    } else {
      throw createError(404, 'Vdo not found or no views yet');
    }
  } catch (err) {
    next(err);
  }
};



module.exports = {
  recordView,
  getVdoViewCount

};
