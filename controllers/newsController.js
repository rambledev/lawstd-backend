const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const createError = require('../middlewares/errorHandler').createError;
const multer = require('multer');
const path = require('path');

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ดึงข่าวสารทั้งหมด
const getAllNews = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tb_news';
    const news = await db.query(query, { type: QueryTypes.SELECT });
    res.json(news);
  } catch (err) {
    next(err);
  }
};

// ดึงข่าวสารตาม ID
const getNewsById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM tb_news WHERE id = ?';
    const result = await db.query(query, {
      replacements: [id],
      type: QueryTypes.SELECT,
    });

    if (result.length === 0) {
      throw createError(404, 'News not found');
    }

    res.json(result[0]);
  } catch (err) {
    next(err);
  }
};

// เพิ่มข่าวสารใหม่
const addNews = async (req, res, next) => {
  const { topic, detail, author } = req.body;
  const files = req.files || {};

  try {
    const img1 = files.img1 ? files.img1[0].filename : null;
    const img2 = files.img2 ? files.img2[0].filename : null;
    const img3 = files.img3 ? files.img3[0].filename : null;
    const img4 = files.img4 ? files.img4[0].filename : null;
    const img5 = files.img5 ? files.img5[0].filename : null;

    const query = `
      INSERT INTO tb_news (topic, detail, img1, img2, img3, img4, img5, author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, {
      replacements: [topic, detail, img1, img2, img3, img4, img5, author],
      type: QueryTypes.INSERT,
    });

    res.status(201).json({ message: 'News created successfully', id: result[0] });
  } catch (err) {
    next(err);
  }
};

// อัปเดตข่าวสาร
const updateNews = async (req, res, next) => {
  const { id } = req.params;
  const { topic, detail, author } = req.body;
  const files = req.files || {};

  try {
    let imagePath = null;
    if (files.img1) {
      imagePath = files.img1[0].filename;
    }

    const query = `
      UPDATE tb_news
      SET topic = ?, detail = ?, author = ?, updated_at = NOW(), img1 = ?
      WHERE id = ?
    `;
    const result = await db.query(query, {
      replacements: [topic, detail, author, imagePath, id],
      type: QueryTypes.UPDATE,
    });

    if (result[0] === 0) {
      throw createError(404, 'News not found');
    }

    res.json({ message: 'News updated successfully' });
  } catch (err) {
    next(err);
  }
};

// ลบข่าวสาร
const deleteNews = async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM tb_news WHERE id = ?';
    const result = await db.query(query, {
      replacements: [id],
      type: QueryTypes.DELETE,
    });

    if (result[0] === 0) {
      throw createError(404, 'News not found');
    }

    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  addNews,
  updateNews,
  deleteNews,
  upload,
};