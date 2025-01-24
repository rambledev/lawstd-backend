const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const createError = require('../middlewares/errorHandler').createError;

// ดึงข้อมูลวิชาทั้งหมด
const getAllSubjects = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tb_subject';
    const subjects = await db.query(query, { type: QueryTypes.SELECT });
    res.json(subjects);
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
      subject: subjectResults[0] || null,
      doc: fileResults,
      vdos: vdoResults,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllSubjects, getSubjectByCode };