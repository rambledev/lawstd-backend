const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// ตรวจสอบว่า route นี้ถูกตั้งค่า
router.post('/login', adminController.loginAdmin);

module.exports = router;