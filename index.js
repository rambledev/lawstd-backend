const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // เชื่อมต่อฐานข้อมูล
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware เพื่อ parse request body
app.use(bodyParser.json());

// ฟังก์ชันเพื่อแสดงคำสั่ง SQL ใน console
const logQuery = (query, replacements) => {
  console.log("Executing query:", query, "with parameters:", replacements);
};

// cors
app.use(cors({
    origin: ['http://localhost:5173','https://lawstd.rmu.ac.th/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // กำหนดวิธีการที่อนุญาต
    credentials: true // อนุญาตให้ส่ง Cookies
}));

console.log("xxxxxxxxxx-2- cors origin = *");

// API สำหรับล็อกอินผู้ดูแลระบบ
app.post('/api/login-admin', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM tb_user WHERE username = ?';
    logQuery(query, [username]);

    const results = await db.query(query, {
      replacements: [username],
      type: db.QueryTypes.SELECT
    });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Username is incorrect' });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    // ตั้งค่าคุกกี้หลังจากล็อกอินสำเร็จ
    const cookieOptions = {
      sameSite: 'None',
      secure: true, // ต้องใช้ HTTPS
    };
    res.cookie('adminId', admin.id, cookieOptions); // ตั้งค่าคุกกี้ที่นี่

    res.json({ message: 'Login successful', adminId: admin.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API สำหรับการดึงรายละเอียดรายวิชา
app.get('/api/subjects/:sub_code', async (req, res, next) => {
  const { sub_code } = req.params;

  try {
    const subjectQuery = 'SELECT * FROM tb_subject WHERE sub_code = ?';
    const filesQuery = 'SELECT * FROM tb_files WHERE sub_code = ?';
    const vdosQuery = 'SELECT * FROM tb_vdo WHERE sub_code = ?';

    logQuery(subjectQuery, [sub_code]);
    logQuery(filesQuery, [sub_code]);
    logQuery(vdosQuery, [sub_code]);

    const [subjectResults, fileResults, vdoResults] = await Promise.all([
      db.query(subjectQuery, { replacements: [sub_code], type: db.QueryTypes.SELECT }),
      db.query(filesQuery, { replacements: [sub_code], type: db.QueryTypes.SELECT }),
      db.query(vdosQuery, { replacements: [sub_code], type: db.QueryTypes.SELECT })
    ]);

    res.json({
      subject: subjectResults[0] || null,
      files: fileResults,
      vdos: vdoResults
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// API สำหรับการดึงรายวิชาทั้งหมด
app.get('/api/subjects', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tb_subject';
    logQuery(query, []);

    const results = await db.query(query, { type: db.QueryTypes.SELECT });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// API สำหรับการเพิ่มรายวิชาใหม่
app.post('/api/subjects', async (req, res, next) => {
  const { sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher } = req.body;

  if (!sub_code || !sub_name || !sub_program || !sub_unit || !sub_term || !sub_teacher) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query =
      'INSERT INTO tb_subject (sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher) VALUES (?, ?, ?, ?, ?, ?)';
    logQuery(query, [sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher]);

    const result = await db.query(query, {
      replacements: [sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher],
      type: db.QueryTypes.INSERT
    });
    res.status(201).json({ message: 'Subject added successfully!', id: result[0].insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// API สำหรับการอัปเดตรายวิชา
app.put('/api/subjects/:id', async (req, res, next) => {
  const { id } = req.params; // ดึง id จาก URL
  const { sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher } = req.body;

  if (!sub_code || !sub_name || !sub_program || !sub_unit || !sub_term || !sub_teacher) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query =
      'UPDATE tb_subject SET sub_code = ?, sub_name = ?, sub_program = ?, sub_unit = ?, sub_term = ?, sub_teacher = ? WHERE id = ?';
    
    logQuery(query, [sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher, id]);

    const result = await db.query(query, {
      replacements: [sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher, id],
      type: db.QueryTypes.UPDATE
    });

    if (result[0].affectedRows === 0) {
      // ถ้าไม่มีแถวที่ถูกอัปเดต
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.status(200).json({ message: 'Subject updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' , str: err });
  }
});

// API สำหรับการจัดการ VDO
app.get('/api/vdos', async (req, res) => {
  try {
    const query = 'SELECT * FROM tb_vdo';
    logQuery(query, []);

    const results = await db.query(query, { type: db.QueryTypes.SELECT });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// API สำหรับการดึง VDO ตาม sub_code พร้อมชื่อวิชา
app.get('/api/vdos-subject/:sub_code', async (req, res) => {
  const { sub_code } = req.params;

  const query = `
    SELECT v.id, v.sub_code, v.vdo_name, v.vdo_link, s.sub_name 
    FROM tb_vdo v 
    INNER JOIN tb_subject s ON v.sub_code = s.sub_code 
    WHERE v.sub_code = ?`;

  logQuery(query, [sub_code]);

  try {
    const results = await db.query(query, { replacements: [sub_code], type: db.QueryTypes.SELECT });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// API สำหรับการดึง VDO ตาม ID
app.get('/api/vdos/:id', async (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM tb_vdo WHERE id = ?';
  logQuery(query, [id]);

  try {
    const results = await db.query(query, { replacements: [id], type: db.QueryTypes.SELECT });
    res.json(results[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Insert VDO
app.post('/api/vdos', async (req, res) => {
  const { sub_code, vdo_name, vdo_link } = req.body;

  const query = 'INSERT INTO tb_vdo (sub_code, vdo_name, vdo_link) VALUES (?, ?, ?)';
  logQuery(query, [sub_code, vdo_name, vdo_link]);

  try {
    const result = await db.query(query, {
      replacements: [sub_code, vdo_name, vdo_link],
      type: db.QueryTypes.INSERT
    });
    res.status(201).json({ message: 'VDO added successfully!', id: result[0].insertId });
  } catch (err) {
    console.error("Error adding VDO:", err);
    res.status(500).json({ error: 'Failed to add VDO' });
  }
});

// API สำหรับการอัปเดต VDO ตาม ID
app.put('/api/vdos/:id', async (req, res) => {
  const { id } = req.params;
  const { sub_code, vdo_name, vdo_link } = req.body;

  const query = 'UPDATE tb_vdo SET sub_code = ?, vdo_name = ?, vdo_link = ? WHERE id = ?';
  logQuery(query, [sub_code, vdo_name, vdo_link, id]);

  try {
    const result = await db.query(query, { replacements: [sub_code, vdo_name, vdo_link, id] });

    if (result[1].affectedRows === 0) {
      return res.status(404).json({ message: 'VDO not found' });
    }
    res.json({ message: 'VDO updated successfully!' });
  } catch (err) {
    console.error("Error updating VDO:", err);
    res.status(500).json({ error: 'Failed to update VDO' });
  }
});

// API สำหรับการลบ VDO ตาม ID
app.delete('/api/vdos/:id', async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM tb_vdo WHERE id = ?';
  logQuery(query, [id]);

  try {
    const result = await db.query(query, { replacements: [id] });

    if (result[1].affectedRows === 0) {
      return res.status(404).json({ message: 'VDO not found' });
    }
    res.json({ message: 'VDO deleted successfully!' });
  } catch (err) {
    console.error("Error deleting VDO:", err);
    res.status(500).json({ error: 'Failed to delete VDO' });
  }
});

app.listen(port, () => {
  console.log(`++++++++++++++++++++++++++ app listening at port:${port}`);
});