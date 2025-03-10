const express = require('express');
const stdController = require('../controllers/stdController');

const router = express.Router();

router.get('/search', stdController.searchStudents); // ✅ เปลี่ยนเป็น Query String
router.get('/std_list/:sub_code', stdController.getStudentBySubCode); // ✅ ควรอยู่ก่อน `:id`

router.post('/', stdController.addStudent);
router.get('/', stdController.getAllStudents);
router.put('/:id', stdController.updateStudent);
router.delete('/:id', stdController.deleteStudent);

router.delete('/students-list/:id', stdController.deleteStudentList);

router.post('/subject-list', stdController.addStudentToSubject);

router.get('/authorized-students', (req, res, next) => {
    console.log("Request received at /authorized-students");
    stdController.getAuthorizedStudents(req, res, next);
  });

router.get('/:id', stdController.getStudentById); // ✅ ต้องอยู่หลังสุด เพื่อไม่ชน `/search`

module.exports = router;
