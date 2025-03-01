const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const { createError } = require('../middlewares/errorHandler');


// อัปเดตวิดีโอ
const updateVdo = async (req, res, next) => {
  const { vdo_id } = req.params;
  const { sub_code, vdo_name, vdo_link } = req.body;

  try {
    const query = `
      UPDATE tb_vdo
      SET sub_code = ?, vdo_name = ?, vdo_link = ?
      WHERE id = ?
    `;
    const result = await db.query(query, {
      replacements: [sub_code, vdo_name, vdo_link, vdo_id],
      type: QueryTypes.UPDATE,
    });

    if (result[0] === 0) {
      throw createError(404, 'Vdo not found');
    }

    res.json({ message: 'Vdo updated successfully' });
  } catch (err) {
    next(err);
  }
};


// เพิ่มวิดีโอใหม่
const addVdo = async (req, res, next) => {
  const { sub_code, vdo_name, vdo_link } = req.body;

  try {
    const query = `
      INSERT INTO tb_vdo (sub_code, vdo_name, vdo_link, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const result = await db.query(query, {
      replacements: [sub_code, vdo_name, vdo_link],
      type: QueryTypes.INSERT,
    });

    res.status(201).json({ message: 'Vdo created successfully', id: result[0] });
  } catch (err) {
    next(err);
  }
};

// ดึงวิดีโอทั้งหมด
const getAllVdos = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tb_vdo';
    const vdos = await db.query(query, { type: QueryTypes.SELECT });
    res.json(vdos);
  } catch (err) {
    next(err);
  }
};

// ดึงวิดีโอตาม ID
const getVdoById = async (req, res, next) => {
  const { vdo_id } = req.params;

  try {
    const query = 'SELECT * FROM tb_vdo WHERE vdo_id = ?';
    const result = await db.query(query, {
      replacements: [vdo_id],
      type: QueryTypes.SELECT,
    });

    if (!result.length) {
      throw createError(404, 'Vdo not found');
    }

    res.json(result[0]);
  } catch (err) {
    next(err);
  }
};

// ลบวิดีโอ
const deleteVdo = async (req, res, next) => {
  const { vdo_id } = req.params;

  try {
    const query = 'DELETE FROM tb_vdo WHERE id = ?';
    const result = await db.query(query, {
      replacements: [vdo_id],
      type: QueryTypes.DELETE,
    });

    if (result && result[1] === 0) {
      return res.status(404).json({ message: 'Vdo not found' });
    }

    res.json({ message: 'Vdo deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ดึงวิดีโอตามรหัสวิชาพร้อมข้อมูล sub_name
const getVdosBySubjectCode = async (req, res, next) => {
  const { sub_code } = req.params;

  try {
    const query = `
      SELECT tb_vdo.*, tb_subject.sub_name
      FROM tb_vdo
      JOIN tb_subject ON tb_vdo.sub_code = tb_subject.sub_code
      WHERE tb_vdo.sub_code = ?
    `;
    const vdos = await db.query(query, {
      replacements: [sub_code],
      type: QueryTypes.SELECT,
    });

    if (vdos.length > 0) {
      res.json(vdos);
    } else {
      throw createError(200, 'No vdos found for this subject');
    }
  } catch (err) {
    next(err);
  }
};

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
  getAllVdos,
  getVdoById,
  addVdo,
  deleteVdo,
  getVdosBySubjectCode,
  recordView,
  getVdoViewCount,
  updateVdo

};
