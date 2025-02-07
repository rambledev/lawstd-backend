const express = require('express');
const stdController = require('../controllers/stdController');

const router = express.Router();

router.post('/', stdController.addStudent); // เพิ่มนักศึกษาใหม่
router.get('/', stdController.getAllStudents); // ดึงข้อมูลนักศึกษา
router.get('/:id', stdController.getStudentById); // ดึงข้อมูลนักศึกษาตาม ID
router.put('/:id', stdController.updateStudent); // อัปเดตข้อมูลนักศึกษา
router.delete('/:id', stdController.deleteStudent); // ลบข้อมูลนักศึกษา
router.get('/subcode/:sub_code', stdController.getStudentBySubCode);  // ดึงข้อมูลนักศึกษาตาม ID

module.exports = router;