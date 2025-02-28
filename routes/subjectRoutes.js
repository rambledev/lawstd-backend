const express = require('express');
const subjectController = require('../controllers/subjectController');

const router = express.Router();

router.get('/', subjectController.getAllSubjects);

router.get('/subjectData', subjectController.getDataSubjects);
router.get('/:sub_code', subjectController.getSubjectByCode);
router.post('/', subjectController.createSubject); // เพิ่ม route สำหรับ POST
router.delete('/:id', subjectController.deleteSubject);
router.put('/:id', subjectController.updateSubject);
router.get('/sub-data/:sub_code', subjectController.getDataSubject);
router.get('/checkPerSub/:std_code/:sub_code', subjectController.checkPermissionSub);


module.exports = router;
