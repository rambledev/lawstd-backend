const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const createError = require('http-errors');
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
      if (!files[i].filename) {
        throw createError(400, `File ${i + 1} does not have a valid filename`);
      }

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
    // ลูปเช็คไฟล์ img1 - img5 และตั้งค่าเป็น null หากไม่มีการอัปโหลดไฟล์
    const imageNames = ['img1', 'img2', 'img3', 'img4', 'img5'];
    imageNames.forEach((img) => {
      if (!files[img]) {
        files[img] = null;
      }
    });

    // สร้างอาร์เรย์ของ path และชื่อไฟล์สำหรับแต่ละไฟล์
    const images = imageNames.map((img) => ({
      path: files[img]?.path ?? null,
      filename: files[img]?.filename ?? null,
    }));

    // เพิ่ม log เพื่อตรวจสอบชื่อไฟล์ที่ถูกอัปโหลด
    console.log('Uploaded file names:', images.map(image => image.filename));

    // ปรับคำสั่ง SQL เพื่อรวมชื่อไฟล์ลงในฐานข้อมูล
    const query = `
      INSERT INTO tb_news (topic, detail, author, img1, img2, img3, img4, img5)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, {
      replacements: [
        topic, 
        detail, 
        author, 
        images[0].filename, 
        images[1].filename, 
        images[2].filename, 
        images[3].filename, 
        images[4].filename
      ],
      type: QueryTypes.INSERT,
    });

    // ตรวจสอบผลลัพธ์และส่ง response
    if (result[0]) {
      res.status(201).json({ message: 'News created successfully', id: result[0] });
    } else {
      throw createError(500, 'Failed to create news');
    }
  } catch (err) {
    console.error('Error adding news:', err);
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

    // ตรวจสอบว่ามีไฟล์ img1
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

    // ตรวจสอบผลลัพธ์
    if (result && result.affectedRows === 0) {
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