const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const createError = require('../middlewares/errorHandler').createError;


// stdController.js
const getAuthorizedStudents = async (req, res, next) => {
  console.log("It's Meeeeeeeee."); // log เพื่อทำการ debug
  try {
    const query = `SELECT * FROM db_laws.tb_subject_list;`; // ตรวจสอบ SQL ที่จะใช้

    const result = await db.query(query, {
      type: QueryTypes.SELECT,
    });

    console.log('Query Result:', result); // Log ผลลัพธ์ที่ได้เพื่อการดีบัก

    if (!result || !result.length) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลนักศึกษาที่ได้รับอนุญาต' });
    }

    res.json(result);
  } catch (err) {
    console.error('Database Query Error:', err);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: err.message });
  }
};



// เพิ่ม นศ. เข้าวิชา
const addStudentToSubject = async (req, res) => {
  try {
    const {  std_code, std_name, status } = req.body;

    // ตรวจสอบว่ามีข้อมูลที่ต้องการก่อน
    if ( !std_code || !std_name || status === undefined) {
      return res.status(400).json({ message: 'กรุณาระบุข้อมูลให้ครบถ้วน' });
    }

    // ตรวจสอบว่านักเรียนมีอยู่ในรายวิชานี้หรือไม่
    const existQuery = `
      SELECT * FROM tb_subject_list 
      WHERE  std_code = ?
    `;
    
    const existingEntry = await db.query(existQuery, {
      replacements: [ std_code],
      type: QueryTypes.SELECT
    });

    if (existingEntry.length > 0) {
      return res.status(409).json({ message: 'นักเรียนคนนี้มีอยู่ในรายวิชานี้แล้ว' });
    }

    // คำสั่ง INSERT เข้าสู่ฐานข้อมูล
    const query = `
      INSERT INTO tb_subject_list ( std_code, std_name, status)
      VALUES ( ?, ?, ?)
    `;

    await db.query(query, {
      replacements: [ std_code, std_name, status], // ต้องแน่ใจว่ามีการส่งค่าครบ 4 ค่า
      type: QueryTypes.INSERT
    });

    res.status(200).json({ message: 'เพิ่มนักเรียนในรายวิชาเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มนักเรียน', error: error.message || error });
  }
};






// เพิ่มนักศึกษาใหม่
const addStudent = async (req, res, next) => {
  const { std_code, std_name, email, password, std_school, faculty, status } = req.body;

  try {
    const query = `
      INSERT INTO tb_student (std_code, std_name, email, password, std_school, faculty, status, registed_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const result = await db.query(query, { replacements: [std_code, std_name, email, password, std_school, faculty, status], type: QueryTypes.INSERT });
    
    res.status(201).json({ message: 'Student added successfully', id: result[0] });
  } catch (err) {
    next(err);
  }
};

// ดึงข้อมูลนักศึกษา
const getAllStudents = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tb_student';
    const students = await db.query(query, { type: QueryTypes.SELECT });
    res.json(students);
  } catch (err) {
    next(err);
  }
};


// ดึงข้อมูลนักศึกษาโดย รหัสวิชา
const getStudentBySubCode = async (req, res, next) => {
  try {
      // ดึงข้อมูลทั้งหมดจาก tb_subject_list
      const query = `
          SELECT * FROM tb_subject_list`;

      const result = await db.query(query, {
          type: QueryTypes.SELECT
      });

      // หากไม่พบข้อมูล
      if (!result.length) {
          return res.status(404).json({ message: 'ไม่พบข้อมูล' });
      }

      // ส่งข้อมูลในรูปแบบ JSON
      res.json(result);
  } catch (err) {
      next(err); // ส่งต่อข้อผิดพลาดให้กับ middleware ถัดไป
  }
};


// ดึงข้อมูลนักศึกษาโดย ID
const getStudentById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM tb_student WHERE std_code = ?';
    const result = await db.query(query, { replacements: [id], type: QueryTypes.SELECT });
    
    if (!result.length) {
      throw createError(404, 'Student not found');
    }

    res.json(result[0]);
  } catch (err) {
    next(err);
  }
};

// อัปเดตข้อมูลนักศึกษา
const updateStudent = async (req, res, next) => {
  const { id } = req.params;
  const { std_name, email, password, std_school, faculty, status } = req.body;

  try {
    const query = `
      UPDATE tb_student
      SET std_name = ?, email = ?, password = ?, std_school = ?, faculty = ?, status = ?
      WHERE std_code = ?
    `;
    const result = await db.query(query, { replacements: [std_name, email, password, std_school, faculty, status, id], type: QueryTypes.UPDATE });

    if (result[0] === 0) {
      throw createError(404, 'Student not found');
    }

    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    next(err);
  }
};

// ลบรายชื่อนักศึกษา
const deleteStudentList = async (req, res, next) => {
  const { id } = req.params;  // รับรหัสนักศึกษา
  const { sub_code } = req.query;  // รับรหัสวิชาจาก query string


  try {
    const query = 'DELETE FROM tb_subject_list WHERE std_code = ? ';
    const result = await db.query(query, { replacements: [id], type: QueryTypes.DELETE });

    // ตรวจสอบว่ามีการลบข้อมูลหรือไม่
    if (result === 0) {  // result จะเป็นจำนวนแถวที่ถูกลบ
      throw createError(404, 'Student or subject not found');
    }

    res.json({ message: 'Student deleted successfully from subject' });
  } catch (err) {
    next(err);
  }
};



// ลบข้อมูลนักศึกษา
const deleteStudent = async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM tb_student WHERE std_code = ?';
    const result = await db.query(query, { replacements: [id], type: QueryTypes.DELETE });

    if (result[0] === 0) {
      throw createError(404, 'Student not found');
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const searchStudents = async (req, res) => {
  console.log("Query Params:", req.query); // ✅ Debug
  const { keyword } = req.query;

  if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
  }

  try {
      const query = `
          SELECT * FROM tb_student 
          WHERE std_code LIKE :keyword OR std_name LIKE :keyword
      `;
      const students = await db.query(query, {
          replacements: { keyword: `%${keyword}%` }, // ✅ ใช้ `%keyword%`
          type: QueryTypes.SELECT
      });

      if (students.length === 0) {
          return res.status(404).json({ message: "No students found" });
      }

      res.json(students);
  } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
};





module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentBySubCode,
  searchStudents,
  addStudentToSubject,
  deleteStudentList,
  getAuthorizedStudents
};