const db = require('../config/db');
const { QueryTypes } = require('sequelize');
const createError = require('http-errors');

const getDataSubjects = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tb_subject ORDER BY sub_code ASC';
    const subjects = await db.query(query, { type: QueryTypes.SELECT });

    res.json({
      data: subjects
    });
  } catch (err) {
    next(err);
  }
};


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
const getSubjectByCode = async (req, res) => {
  let { sub_code } = req.params;
  console.log("Received sub_code:", sub_code);

  try {
    if (!sub_code) {
      return res.status(400).json({ error: "sub_code is required" });
    }

    console.log("🔹 sub_code received:", sub_code);

    // ใช้ `?` แทน `:sub_code`
    const subjectQuery = 'SELECT * FROM tb_subject WHERE sub_code = ?';
    const docQuery = 'SELECT * FROM tb_files WHERE sub_code = ?';
    const vdoQuery = 'SELECT * FROM tb_vdo WHERE sub_code = ?';

    console.log("🔹 Querying tb_subject for sub_code:", sub_code);

    // ส่ง `sub_code` เป็น **Array** แทน Object
    const subjectResults = await db.query(subjectQuery, {
      replacements: [sub_code],  // ✅ แก้จาก { sub_code } เป็น [sub_code]
      type: QueryTypes.SELECT,
    });

    console.log("🔹 Subject results:", subjectResults);

    if (!subjectResults.length) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const fileResults = await db.query(docQuery, {
      replacements: [sub_code],  // ✅ ใช้ Array
      type: QueryTypes.SELECT,
    });

    const vdoResults = await db.query(vdoQuery, {
      replacements: [sub_code],  // ✅ ใช้ Array
      type: QueryTypes.SELECT,
    });

    res.json({
      success: true,
      data: {
        subject: subjectResults[0],
        documents: fileResults || [],
        videos: vdoResults || [],
      },
    });

  } catch (err) {
    console.error("❌ Error in getSubjectByCode:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
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
const updateSubject = async (req, res) => {
  const { id } = req.params;
  let { sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher } = JSON.parse(JSON.stringify(req.body));

  console.log("📥 Cleaned Request Body:", { sub_code, sub_name, sub_program, sub_unit, sub_term, sub_teacher });

  if (!sub_code || !sub_name || sub_unit === undefined || !sub_term || !sub_teacher) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
  }

  try {
      const query = `
          UPDATE tb_subject
          SET sub_code = ?, sub_name = ?, sub_program = ?, sub_unit = ?, sub_term = ?, sub_teacher = ?
          WHERE id = ?
      `;
      const values = [sub_code, sub_name, sub_program || null, sub_unit, sub_term, sub_teacher, id];

      console.log("🚀 Executing query:", query, "with values:", values);

      const result = await db.query(query, {
          replacements: values,
          type: QueryTypes.UPDATE
      });

      console.log("✅ Query Result:", result);

      if (result[1] === 0) {
          return res.status(404).json({ message: "ไม่พบรายวิชา" });
      }

      res.json({ message: "อัปเดตรายวิชาสำเร็จ" });
  } catch (error) {
      console.error("❌ Error updating subject:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error });
  }
};





// ลบรายวิชา
const deleteSubject = async (req, res, next) => {
  const { id } = req.params;
  console.log("Deleting subject with ID:", id);

  try {
    const query = 'DELETE FROM tb_subject WHERE id = ?';
    const result = await db.query(query, {
      replacements: [id],
      type: QueryTypes.RAW, // ใช้ QueryTypes.RAW เพื่อให้รองรับรูปแบบข้อมูลที่คืนค่า
    });

    console.log("Delete Result:", result); // เช็คค่าที่ได้จาก db.query()

    // ตรวจสอบผลลัพธ์ ว่ามีการลบหรือไม่
    if (!result || result[0]?.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบรายวิชาที่ต้องการลบ' });
    }

    res.json({ success: true, message: 'ลบรายวิชาสำเร็จ' });

  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์', error: err.message });
  }
};

// ดึงข้อมูลวิชาตามรหัสวิชา และข้อมูลอื่นๆ (ไฟล์, วิดีโอ)
const getDataSubject = async (req, res, next) => {
  let { sub_code } = req.params;
  console.log("Received sub_code:", sub_code); // เพิ่มตรงนี้เพื่อดูค่าที่ได้รับ

  try {
    if (!sub_code) {
      return res.status(400).json({ error: "sub_code is required" });
    }

    sub_code = sub_code.trim();

    console.log("🔹 sub_code received:", sub_code);

    // คำสั่ง SQL สำหรับดึงข้อมูลวิชา
    const subjectQuery = 'SELECT * FROM tb_subject WHERE sub_code = :sub_code';
    const docQuery = 'SELECT * FROM tb_files WHERE sub_code = :sub_code';
    const vdoQuery = 'SELECT * FROM tb_vdo WHERE sub_code = :sub_code';

    console.log("🔹 Querying tb_subject for sub_code:", sub_code);

    // ดึงข้อมูลวิชาจาก tb_subject
    const [subjectResults] = await db.query(subjectQuery, {
      replacements: { sub_code },
      type: QueryTypes.SELECT,
    });

    console.log("🔹 Subject results:", subjectResults); // ดูผลลัพธ์ที่ได้จากฐานข้อมูล
    
    

    if (!subjectResults || subjectResults.length === 0) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // ดึงข้อมูลจาก tb_files
    const [fileResults] = await db.query(docQuery, {
      replacements: { sub_code },
      type: QueryTypes.SELECT,
    });
    console.log("🔹 docQuery results:", fileResults); // ดูผลลัพธ์ที่ได้จากฐานข้อมูล
    // ดึงข้อมูลจาก tb_vdo
    const [vdoResults] = await db.query(vdoQuery, {
      replacements: { sub_code },
      type: QueryTypes.SELECT,
    });
    console.log("🔹 vdoQuery results:", vdoResults); // ดูผลลัพธ์ที่ได้จากฐานข้อมูล
    // ส่งข้อมูลทั้งหมดกลับไปยัง client
    res.json({
      success: true,
      data: {
        subject: subjectResults || [], // ส่งข้อมูลวิชาหมายเลขแรก
        documents: fileResults || [], // ส่งข้อมูลไฟล์หากมี หรือเป็น array ว่างๆ
        videos: vdoResults || [], // ส่งข้อมูลวิดีโอหากมี หรือเป็น array ว่างๆ
      },
    });

  } catch (err) {
    console.error("❌ Error in getDataSubject:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};


// เช็คสิทธิ์การเข้าถึงรายวิชา
const checkPermissionSub = async (req, res, next) => {
  const { std_code, sub_code } = req.params;

  console.log("Received std_code and sub_code:", { std_code, sub_code });

  try {
    if (!std_code || !sub_code) {
      return res.status(400).json({ error: "Both std_code and sub_code are required" });
    }

    const query = `
      SELECT sub_code, std_code, status
      FROM tb_subject_list
      WHERE std_code = :std_code AND sub_code = :sub_code
    `;

    // ค้นหาข้อมูลจาก tb_subject_list
    const [results] = await db.query(query, {
      replacements: { std_code, sub_code },
      type: QueryTypes.SELECT,
    });

    console.log("🔹 Query result:", results);

    // ถ้าไม่มีข้อมูลใน tb_subject_list
    if (!results || results.length === 0) {
      return res.status(200).json({ status: "inactive" }); // ส่ง status เป็น inactive แทน error
    }
    

    // ส่งข้อมูลกลับไป
    res.json({
      success: true,
      data: results[0],  // ส่งผลลัพธ์รายการแรกที่ตรงกับเงื่อนไข
    });
  } catch (err) {
    console.error("❌ Error in checkPermissionSub:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

module.exports = { getDataSubject, getAllSubjects, getSubjectByCode, createSubject, updateSubject, deleteSubject, checkPermissionSub };

