const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Route สำหรับล็อกอิน
router.post('/login', adminController.loginAdmin);

// Route สำหรับตั้งค่ารหัสผ่านใหม่ของ admin
router.post('/reset-password', adminController.resetAdminPassword);



module.exports = router;