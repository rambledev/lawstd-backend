const express = require('express');
const newsController = require('../controllers/newsController');

const router = express.Router();

// Route for getting all news
router.get('/', newsController.getAllNews);

// Route for getting news by id
router.get('/:id', newsController.getNewsById);

// Route for adding news
router.post('/', 
  newsController.upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
    { name: 'img4', maxCount: 1 },
    { name: 'img5', maxCount: 1 },
  ]), 
  newsController.addNews
);

// Route for updating news
router.put('/:id', 
  newsController.upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
    { name: 'img4', maxCount: 1 },
    { name: 'img5', maxCount: 1 },
  ]), 
  newsController.updateNews
);

// Route for deleting news
router.delete('/:id', newsController.deleteNews);

module.exports = router;
