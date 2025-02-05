const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const createError = require('../middlewares/errorHandler').createError;
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

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

// ฟังก์ชันสำหรับปรับขนาดภาพและสร้าง thumbnail
const uploadImages = async (files) => {
  const imagePaths = [];

  for (let i = 0; i < files.length; i++) {
    if (files[i]) {
      const filePath = path.join('uploads', files[i].filename);
      const thumbnailPath = path.join('uploads', `thumb-${files[i].filename}`);

      // ใช้ sharp เพื่อสร้าง thumbnail
      await sharp(filePath)
        .resize(150, 150) // ปรับขนาดเป็น 150x150 px
        .toFile(thumbnailPath);

      imagePaths.push(files[i].filename);
    } else {
      imagePaths.push(null);
    }
  }

  return imagePaths;
};

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
    const images = await uploadImages([files.img1, files.img2, files.img3, files.img4, files.img5]);

    const query = `
      INSERT INTO tb_news (topic, detail, img1, img2, img3, img4, img5, author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, {
      replacements: [topic, detail, images[0], images[1], images[2], images[3], images[4], author],
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
    const images = [];

    // ดาวน์เกรดการจัดการภาพ
    if (files.img1) {
      images[0] = await uploadImages([files.img1])[0];
    }

    const query = `
      UPDATE tb_news
      SET topic = ?, detail = ?, author = ?, updated_at = NOW(), img1 = ?
      WHERE id = ?
    `;
    const result = await db.query(query, {
      replacements: [topic, detail, author, images[0] || null, id],
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