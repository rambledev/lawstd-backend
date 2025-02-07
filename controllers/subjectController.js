const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const createError = require('http-errors');

// ดึงข้อมูลวิชาทั้งหมด
const getAllSubjects = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tb_subject ORDER BY sub_code ASC';
    const subjects = await db.query(query, { type: QueryTypes.SELECT });

    res.json({
      success: true,
      data: subjects
    });
  } catch (err) {
    next(err);
  }
};

// ดึงข้อมูลวิชาตามรหัสวิชา
const getSubjectByCode = async (req, res, next) => {
  const { sub_code } = req.params;

  try {
    const subjectQuery = 'SELECT * FROM tb_subject WHERE sub_code = ?';
    const docQuery = 'SELECT * FROM tb_files WHERE sub_code = ?';
    const vdosQuery = 'SELECT * FROM tb_vdo WHERE sub_code = ?';

    const [subjectResults, fileResults, vdoResults] = await Promise.all([
      db.query(subjectQuery, { replacements: [sub_code], type: QueryTypes.SELECT }),
      db.query(docQuery, { replacements: [sub_code], type: QueryTypes.SELECT }),
      db.query(vdosQuery, { replacements: [sub_code], type: QueryTypes.SELECT }),
    ]);

    if (!subjectResults.length) {
      throw createError(404, 'Subject not found');
    }

    res.json({
      success: true,
      data: {
        subject: subjectResults[0],
        documents: fileResults,
        videos: vdoResults
      }
    });
  } catch (err) {
    next(err);
  }
};

// สร้างวิชาใหม่
const createSubject = async (req, res, next) => {
  const { sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher } = req.body;

  try {
    const existingSubject = await db.query('SELECT * FROM tb_subject WHERE sub_code = ?', {
      replacements: [sub_code],
      type: QueryTypes.SELECT,
    });

    if (existingSubject.length) {
      throw createError(400, 'รหัสวิชานี้มีอยู่แล้ว');
    }

    const query = 'INSERT INTO tb_subject (sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(query, {
      replacements: [sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher],
      type: QueryTypes.INSERT,
    });

    res.status(201).json({ 
      success: true,
      message: 'สร้างรายวิชาสำเร็จ'
    });
  } catch (err) {
    next(err);
  }
};

// อัปเดตรายวิชา
const updateSubject = async (req, res, next) => {
  const { id } = req.params;
  const { sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher } = req.body;

  try {
    const existingSubject = await db.query('SELECT * FROM tb_subject WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.SELECT,
    });

    if (!existingSubject.length) {
      throw createError(404, 'ไม่พบรายวิชา');
    }

    const query = `
      UPDATE tb_subject
      SET sub_code = ?, sub_name = ?, sub_program = ?, sub_unit = ?, sub_term = ?, sub_teacher = ?
      WHERE id = ?
    `;

    const [result] = await db.query(query, {
      replacements: [sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher, id],
      type: QueryTypes.UPDATE,
    });

    if (!result) {
      throw createError(400, 'ไม่สามารถอัปเดตรายวิชาได้');
    }

    res.json({ 
      success: true,
      message: 'อัปเดตรายวิชาสำเร็จ'
    });
  } catch (err) {
    next(err);
  }
};

// ลบรายวิชา
const deleteSubject = async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM tb_subject WHERE id = ?';
    const [result] = await db.query(query, {
      replacements: [id],
      type: QueryTypes.DELETE,
    });

    if (!result || result.affectedRows === 0) {
      throw createError(404, 'ไม่พบรายวิชาที่ต้องการลบ');
    }

    res.json({
      success: true,
      message: 'ลบรายวิชาสำเร็จ'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllSubjects, getSubjectByCode, createSubject, updateSubject, deleteSubject };
