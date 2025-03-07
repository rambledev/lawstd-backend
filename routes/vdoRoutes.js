const express = require('express');
const vdoController = require('../controllers/vdoController');

const router = express.Router();

router.get('/:sub_code', vdoController.getVdosBySubjectCode);
router.post('/', vdoController.addVdo);
router.put('/:vdo_id', vdoController.updateVdo);
router.delete('/:vdo_id', vdoController.deleteVdo);

router.post('/vdo/view', vdoController.recordView);
// เพิ่มเส้นทางสำหรับดูยอดวิวรวม
router.get('/vdo/:vdo_id/views', vdoController.getVdoViewCount);

module.exports = router;