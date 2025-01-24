const express = require('express');
const subjectController = require('../controllers/subjectController');

const router = express.Router();

router.get('/', subjectController.getAllSubjects);
router.get('/:sub_code', subjectController.getSubjectByCode);

module.exports = router;