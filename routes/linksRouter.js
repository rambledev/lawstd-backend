// routes/linksRoutes.js
const express = require('express');
const router = express.Router();
const linksController = require('../controllers/linksController');

// GET: หา links ทั้งหมด
router.get('/', linksController.getLinks);

// POST: เพิ่ม link ใหม่
router.post('/', linksController.addLink);

// PUT: อัปเดต link
router.put('/:id', linksController.updateLink);

// DELETE: ลบ link
router.delete('/:id', linksController.deleteLink);

module.exports = router;