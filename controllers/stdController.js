const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const createError = require('../middlewares/errorHandler').createError;

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
    const { id } = req.params;
  
    try {
      const query = 'SELECT * FROM tb_subject_list WHERE sub_code = ?';
      const result = await db.query(query, { replacements: [id], type: QueryTypes.SELECT });
      
      if (!result.length) {
        throw createError(404, 'Student not found');
      }
  
      res.json(result[0]);
    } catch (err) {
      next(err);
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

module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentBySubCode,
};