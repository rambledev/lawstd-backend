const express = require('express');
const vdoController = require('../controllers/vdoController');

const router = express.Router();

router.get('/:sub_code', vdoController.getVdosBySubjectCode);
router.post('/', vdoController.addVdo);
router.delete('/:vdo_id', vdoController.deleteVdo);

module.exports = router;