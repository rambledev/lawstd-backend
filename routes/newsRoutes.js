const express = require('express');
const newsController = require('../controllers/newsController');

const router = express.Router();

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', newsController.upload.fields([
  { name: 'img1', maxCount: 1 },
  { name: 'img2', maxCount: 1 },
  { name: 'img3', maxCount: 1 },
  { name: 'img4', maxCount: 1 },
  { name: 'img5', maxCount: 1 },
]), newsController.addNews);
router.put('/:id', newsController.upload.fields([{ name: 'img1', maxCount: 1 }]), newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router;