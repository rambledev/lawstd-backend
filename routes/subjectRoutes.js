const express = require('express');
const subjectController = require('../controllers/subjectController');

const router = express.Router();

router.get('/', subjectController.getAllSubjects);
router.get('/:sub_code', subjectController.getSubjectByCode);
router.post('/', subjectController.createSubject); // เพิ่ม route สำหรับ POST
router.delete('/:id', subjectController.deleteSubject);
router.put('/:id', subjectController.updateSubject);


module.exports = router;