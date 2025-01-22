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
app.use(cors(corsOptions));

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

// Catch-all route for undefined endpoints
app.use((req, res, next) => {
  next(createError(404, 'Endpoint not found'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
