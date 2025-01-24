const express = require('express');
const docController = require('../controllers/docController');

const router = express.Router();

router.post('/', docController.addDocument);
router.get('/', docController.getAllDocuments);
router.get('/:id', docController.getDocumentById);
router.put('/:id', docController.updateDocument);
router.delete('/:id', docController.deleteDocument);
router.get('/doc-subject/:subjectCode', docController.getDocumentsBySubjectCode);

module.exports = router;