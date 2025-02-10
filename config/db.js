const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // ชื่อฐานข้อมูล
  process.env.DB_USER, // ชื่อผู้ใช้
  process.env.DB_PASSWORD, // รหัสผ่าน
  {
    host: process.env.DB_HOST, // host ของฐานข้อมูล
    port: process.env.DB_PORT, // พอร์ตของฐานข้อมูล
    dialect: 'mysql', // ใช้ 'mysql' เป็น dialect
    dialectModule: require('mysql2'), // ใช้ mysql2 เป็น dialect module
    pool: {
      max: 10, // จำนวน connection สูงสุด
      min: 0, // จำนวน connection ต่ำสุด
      acquire: 30000, // เวลารอ connection (มิลลิวินาที)
      idle: 10000, // เวลาที่ connection จะถูกปล่อยหากไม่ใช้งาน (มิลลิวินาที)
    },
    logging: console.log, // เปิด logging เพื่อดู query
  }
);

module.exports = sequelize;
