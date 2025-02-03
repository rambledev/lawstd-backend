const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const createError = require('../middlewares/errorHandler').createError;

// เพิ่มเอกสารใหม่
const addDocument = async (req, res, next) => {
  const { sub_code, file_name, file_link } = req.body;

  try {
    const query = `
      INSERT INTO tb_files (sub_code, file_name, file_link, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const result = await db.query(query, {
      replacements: [sub_code, file_name, file_link],
      type: QueryTypes.INSERT,
    });

    res.status(201).json({ message: 'Document added successfully', id: result[0] });
  } catch (err) {
    next(err);
  }
};

// ดึงเอกสารทั้งหมด
const getAllDocuments = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tb_files';
    const files = await db.query(query, { type: QueryTypes.SELECT });
    res.json(files);
  } catch (err) {
    next(err);
  }
};

// ดึงเอกสารตาม ID
const getDocumentById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM tb_files WHERE id = ?';
    const result = await db.query(query, {
      replacements: [id],
      type: QueryTypes.SELECT,
    });

    if (!result.length) {
      throw createError(404, 'Document not found');
    }

    res.json(result[0]);
  } catch (err) {
    next(err);
  }
};

// อัปเดตเอกสาร
const updateDocument = async (req, res, next) => {
  const { id } = req.params;
  const { sub_code, file_name, file_link } = req.body;

  try {
    const query = `
      UPDATE tb_files
      SET sub_code = ?, file_name = ?, file_link = ?
      WHERE id = ?
    `;
    const result = await db.query(query, {
      replacements: [sub_code, file_name, file_link, id],
      type: QueryTypes.UPDATE,
    });

    if (result[0] === 0) {
      throw createError(404, 'Document not found');
    }

    res.json({ message: 'Document updated successfully' });
  } catch (err) {
    next(err);
  }
};

// ลบเอกสาร
const deleteDocument = async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM tb_files WHERE id = ?';
    const result = await db.query(query, {
      replacements: [id],
      type: QueryTypes.DELETE,
    });

    if (result[0] === 0) {
      throw createError(404, 'Document not found');
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ดึงเอกสารตามรหัสวิชาพร้อมข้อมูล sub_name
const getDocumentsBySubjectCode = async (req, res, next) => {
  const { subjectCode } = req.params;

  try {
    const query = `
      SELECT tb_files.*, tb_subject.sub_name
      FROM tb_files
      JOIN tb_subject ON tb_files.sub_code = tb_subject.sub_code
      WHERE tb_files.sub_code = ?
    `;
    console.log("Subject code received:", subjectCode);
    const documents = await db.query(query, {
      replacements: [subjectCode],
      type: QueryTypes.SELECT,
    });

    if (documents.length > 0) {
      res.json(documents);
    } else {
      throw createError(404, 'No documents found for this subject');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentsBySubjectCode,
};