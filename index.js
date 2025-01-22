const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // เพิ่มการใช้งาน CORS
const bodyParser = require('body-parser'); // เพิ่ม bodyParser
const db = require('./db'); // Assume you have a db connection module
const { QueryTypes } = require('sequelize');

const app = express();
const port = 3000;

// Middleware เพื่อ parse request body
app.use(bodyParser.json());

// ฟังก์ชันเพื่อแสดงคำสั่ง SQL ใน console
const logQuery = (query, replacements) => {
  console.log("Executing query:", query, "with parameters:", replacements);
};

// ตั้งค่า CORS สำหรับ Production
const corsOptions = {
  origin:  [
    'http://localhost:5173', // Frontend development
    'https://lawstd.rmu.ac.th', // Frontend production
  ], // URL ของ frontend ใน production
  credentials: true, // อนุญาตการส่ง cookie
};
app.use(cors({
  origin: ['http://localhost:5173', 'https://lawstd.rmu.ac.th'], // เพิ่มโดเมนที่อนุญาต
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // รองรับการส่ง cookies
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Helper function to create error objects
function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Hide stack trace in production
    },
  });
});

// API for admin login
app.post('/api/login-admin', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw createError(400, 'Username and password are required');
    }

    const query = 'SELECT * FROM tb_user WHERE username = ?';
    logQuery(query, [username]);

    const results = await db.query(query, {
      replacements: [username],
      type: QueryTypes.SELECT,
    });

    if (results.length === 0) {
      throw createError(401, 'Username is incorrect');
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw createError(401, 'Password is incorrect');
    }

    const cookieOptions = {
      sameSite: 'None', // รองรับการทำงานข้ามโดเมน
      secure: true, // บังคับให้ใช้ HTTPS
    };
    res.cookie('adminId', admin.id, cookieOptions);

    res.json({ message: 'Login successful', adminId: admin.id });
  } catch (err) {
    console.error('Login Error:', err.message);
    next(err);
  }
});


// API for fetching all subjects
app.get('/api/subjects', async (req, res, next) => {
  try {
    const subjectQuery = 'SELECT * FROM tb_subject';

    logQuery(subjectQuery, []); // log query execution

    const subjects = await db.query(subjectQuery, {
      type: QueryTypes.SELECT,
    });

    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects:', err.message);
    next(err);
  }
});

// API for fetching subject details
app.get('/api/subjects/:sub_code', async (req, res, next) => {
  const { sub_code } = req.params;

  try {
    if (!sub_code) {
      throw createError(400, 'Subject code is required');
    }

    const subjectQuery = 'SELECT * FROM tb_subject WHERE sub_code = ?';
    const docQuery = 'SELECT * FROM tb_files WHERE sub_code = ?';
    const vdosQuery = 'SELECT * FROM tb_vdo WHERE sub_code = ?';

    logQuery(subjectQuery, [sub_code]);
    logQuery(docQuery, [sub_code]);
    logQuery(vdosQuery, [sub_code]);

    const [subjectResults, fileResults, vdoResults] = await Promise.all([
      db.query(subjectQuery, { replacements: [sub_code], type: QueryTypes.SELECT }),
      db.query(docQuery, { replacements: [sub_code], type: QueryTypes.SELECT }),
      db.query(vdosQuery, { replacements: [sub_code], type: QueryTypes.SELECT }),
    ]);

    if (!subjectResults.length) {
      throw createError(404, 'Subject not found');
    }

    res.json({
      subject: subjectResults[0] || null,
      doc: fileResults,
      vdos: vdoResults,
    });
  } catch (err) {
    console.error('Error fetching subject:', err.message);
    next(err);
  }
});


// doc
// API สำหรับเพิ่มเอกสารใหม่
app.post('/api/doc', async (req, res, next) => {
  const { sub_code, file_name, file_link } = req.body;

  try {
    if (!sub_code || !file_name || !file_link) {
      throw createError(400, 'sub_code, file_name, and file_link are required');
    }

    const query = `
      INSERT INTO tb_files (sub_code, file_name, file_link, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    logQuery(query, [sub_code, file_name, file_link]);

    const result = await db.query(query, {
      replacements: [sub_code, file_name, file_link],
      type: QueryTypes.INSERT,
    });

    res.status(201).json({ message: 'Document added successfully', id: result[0] });
  } catch (err) {
    console.error('Error adding document:', err.message);
    next(err);
  }
});
// API สำหรับดึงเอกสารทั้งหมด
app.get('/api/docs', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tb_files';
    logQuery(query, []);

    const files = await db.query(query, {
      type: QueryTypes.SELECT,
    });

    res.json(files);
  } catch (err) {
    console.error('Error fetching documents:', err.message);
    next(err);
  }
});
// API สำหรับดึงเอกสารตาม ID
app.get('/api/doc/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM tb_files WHERE id = ?';
    logQuery(query, [id]);

    const result = await db.query(query, {
      replacements: [id],
      type: QueryTypes.SELECT,
    });

    if (!result.length) {
      throw createError(404, 'Document not found');
    }

    res.json(result[0]);
  } catch (err) {
    console.error('Error fetching document:', err.message);
    next(err);
  }
});
// API สำหรับอัปเดตเอกสาร
app.put('/api/doc/:id', async (req, res, next) => {
  const { id } = req.params;
  const { sub_code, file_name, file_link } = req.body;

  try {
    if (!sub_code || !file_name || !file_link) {
      throw createError(400, 'sub_code, file_name, and file_link are required');
    }

    const query = `
      UPDATE tb_files
      SET sub_code = ?, file_name = ?, file_link = ?
      WHERE id = ?
    `;
    logQuery(query, [sub_code, file_name, file_link, id]);

    const result = await db.query(query, {
      replacements: [sub_code, file_name, file_link, id],
      type: QueryTypes.UPDATE,
    });

    if (result[0] === 0) {
      throw createError(404, 'Document not found');
    }

    res.json({ message: 'Document updated successfully' });
  } catch (err) {
    console.error('Error updating document:', err.message);
    next(err);
  }
});
// API สำหรับลบเอกสาร
app.delete('/api/doc/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM tb_files WHERE id = ?';
    logQuery(query, [id]);

    const result = await db.query(query, {
      replacements: [id],
      type: QueryTypes.DELETE,
    });

    if (result[0] === 0) {
      throw createError(404, 'Document not found');
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Error deleting document:', err.message);
    next(err);
  }
});
// Route สำหรับดึงเอกสารตามรหัสวิชาพร้อมข้อมูล sub_name
app.get('/api/doc-subject/:subjectCode', async (req, res) => {
  const subjectCode = req.params.subjectCode;
  try {
    const query = `
      SELECT tb_files.*, tb_subject.sub_name
      FROM tb_files
      JOIN tb_subject ON tb_files.sub_code = tb_subject.sub_code
      WHERE tb_files.sub_code = ?
    `;
    logQuery(query, [subjectCode]);

    const documents = await db.query(query, {
      replacements: [subjectCode],
      type: QueryTypes.SELECT,
    });

    if (documents.length > 0) {
      res.json(documents);
    } else {
      res.status(404).json({ message: 'No documents found for this subject.' });
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Error fetching documents.' });
  }
});

// API for fetching all vdos by subject code
app.get('/api/vdos/:sub_code', async (req, res, next) => {
  const { sub_code } = req.params;

  try {
    const vdoQuery = 'SELECT * FROM tb_vdo WHERE sub_code = :sub_code';
    logQuery(vdoQuery, { sub_code });

    const vdos = await db.query(vdoQuery, {
      replacements: { sub_code },
      type: QueryTypes.SELECT,
    });

    res.json(vdos);
  } catch (err) {
    console.error('Error fetching vdos:', err.message);
    next(err);
  }
});

// API for creating a new vdo
app.post('/api/vdo', async (req, res, next) => {
  const { sub_code, vdo_name, vdo_link } = req.body;

  try {
    const insertVdoQuery = `
      INSERT INTO tb_vdo (sub_code, vdo_name, vdo_link)
      VALUES (:sub_code, :vdo_name, :vdo_link)
    `;
    
    logQuery(insertVdoQuery, { sub_code, vdo_name, vdo_link });

    await db.query(insertVdoQuery, {
      replacements: { sub_code, vdo_name, vdo_link },
      type: QueryTypes.INSERT,
    });

    res.status(201).json({ message: 'Vdo created successfully' });
  } catch (err) {
    console.error('Error creating vdo:', err.message);
    next(err);
  }
});
// API for deleting a vdo by ID
app.delete('/api/vdo/:vdo_id', async (req, res, next) => {
  const { vdo_id } = req.params;

  try {
    const deleteVdoQuery = 'DELETE FROM tb_vdo WHERE vdo_id = :vdo_id';

    logQuery(deleteVdoQuery, { vdo_id });

    const result = await db.query(deleteVdoQuery, {
      replacements: { vdo_id },
      type: QueryTypes.DELETE,
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: 'Vdo not found' });
    }

    res.json({ message: 'Vdo deleted successfully' });
  } catch (err) {
    console.error('Error deleting vdo:', err.message);
    next(err);
  }
});

// API for updating a subject
app.put('/api/subject/:sub_code', async (req, res, next) => {
  const { sub_code } = req.params;  // รับค่า sub_code จาก URL
  const { sub_name, sub_program, sub_unit, sub_term, sub_teacher } = req.body;  // รับข้อมูลจาก body

  try {
    // Query สำหรับอัปเดตข้อมูลในตาราง tb_subject
    const updateQuery = `
      UPDATE tb_subject 
      SET sub_name = :sub_name, sub_program = :sub_program, sub_unit = :sub_unit, sub_term = :sub_term, sub_teacher = :sub_teacher
      WHERE sub_code = :sub_code
    `;

    logQuery(updateQuery, { sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher });  // บันทึกการ query สำหรับ log

    // ดำเนินการอัปเดตข้อมูลในฐานข้อมูล
    const result = await db.query(updateQuery, {
      replacements: { sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher },
      type: QueryTypes.UPDATE,
    });

    // หากไม่พบข้อมูลที่ต้องการอัปเดต
    if (result[0] === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // ส่งคำตอบกลับเมื่ออัปเดตสำเร็จ
    res.json({ message: 'Subject updated successfully' });
  } catch (err) {
    console.error('Error updating subject:', err.message);  // log ข้อผิดพลาด
    next(err);  // ส่งข้อผิดพลาดไปยัง handler ถัดไป
  }
});



// API สำหรับดึงข้อมูลข่าวสารทั้งหมด
app.get('/api/news', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tb_news';
    logQuery(query, []);

    const news = await db.query(query, {
      type: QueryTypes.SELECT
    });

    res.json(news);
  } catch (err) {
    console.error('Error fetching news:', err.message);
    next(err);
  }
});

// API สำหรับดึงข้อมูลข่าวสารตาม ID
app.get('/api/news/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM tb_news WHERE id = ?';
    logQuery(query, [id]);

    const result = await db.query(query, {
      replacements: [id],
      type: QueryTypes.SELECT
    });

    if (result.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(result[0]);
  } catch (err) {
    console.error('Error fetching news:', err.message);
    next(err);
  }
});

// API สำหรับเพิ่มข่าวสารใหม่
app.post('/api/news', async (req, res, next) => {
  const multer = require('multer');
const path = require('path');

// กำหนดการตั้งค่า multer สำหรับการอัพโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // โฟลเดอร์สำหรับจัดเก็บไฟล์
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
  },
});

const upload = multer({ storage });

app.post('/api/news', upload.fields([
  { name: 'img1', maxCount: 1 },
  { name: 'img2', maxCount: 1 },
  { name: 'img3', maxCount: 1 },
  { name: 'img4', maxCount: 1 },
  { name: 'img5', maxCount: 1 },
]), async (req, res, next) => {
  const { topic, detail, author } = req.body;

  try {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!topic || !detail) {
      return res.status(400).json({ error: 'Topic and detail are required' });
    }

    // จัดการไฟล์ภาพ
    const files = req.files;
    const img1 = files.img1 ? files.img1[0].filename : null;
    const img2 = files.img2 ? files.img2[0].filename : null;
    const img3 = files.img3 ? files.img3[0].filename : null;
    const img4 = files.img4 ? files.img4[0].filename : null;
    const img5 = files.img5 ? files.img5[0].filename : null;

    // เพิ่มข้อมูลข่าวลงในฐานข้อมูล
    const insertQuery = `
      INSERT INTO tb_news (topic, detail, img1, img2, img3, img4, img5, author, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await db.query(insertQuery, {
      replacements: [topic, detail, img1, img2, img3, img4, img5, author],
      type: QueryTypes.INSERT,
    });

    res.status(201).json({ message: 'News created successfully', id: result[0] });
  } catch (err) {
    console.error('Error adding news:', err.message);
    next(err);
  }
});

});

// Error Middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});


// API สำหรับอัปเดตข่าวสาร
app.put('/api/news/:id', async (req, res, next) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  try {
    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    const updateQuery = `
      UPDATE tb_news
      SET title = ?, content = ?, author = ?, updated_at = NOW()
      WHERE id = ?
    `;
    logQuery(updateQuery, [title, content, author, id]);

    const result = await db.query(updateQuery, {
      replacements: [title, content, author, id],
      type: QueryTypes.UPDATE
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News updated successfully' });
  } catch (err) {
    console.error('Error updating news:', err.message);
    next(err);
  }
});

// API สำหรับลบข่าวสาร
app.delete('/api/news/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleteQuery = 'DELETE FROM tb_news WHERE id = ?';
    logQuery(deleteQuery, [id]);

    const result = await db.query(deleteQuery, {
      replacements: [id],
      type: QueryTypes.DELETE
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    console.error('Error deleting news:', err.message);
    next(err);
  }
});








// Catch-all route for undefined endpoints
app.use((req, res, next) => {
  next(createError(404, 'Endpoint not found'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("commit = 1");
});
