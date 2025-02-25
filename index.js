const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/db');
const { errorHandler } = require('./middlewares/errorHandler');

// Routes
const adminRoutes = require('./routes/adminRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const docRoutes = require('./routes/docRoutes');
const vdoRoutes = require('./routes/vdoRoutes');
const newsRoutes = require('./routes/newsRoutes');
const linksRoutes = require('./routes/linksRouter');
const stdRouters = require('./routes/stdRoutes');
const statRouters = require('./routes/statRoutes');
const dashRouters = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

// Static files for images in /uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
  setHeaders: (res, path, stat) => {
    // ตั้งค่า headers ให้อนุญาตการเข้าถึงจากโดเมนที่ต้องการ
    res.set('Access-Control-Allow-Origin', '*'); // อนุญาตจากโดเมน frontend
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // เพิ่ม headers หากจำเป็น
  }
}));

// แก้ไขเพิ่มเติมหากมีการใช้งานการ request แบบ OPTIONS
app.options('/uploads/*', cors({
  origin: 'https://lawstd.rmu.ac.th', // กำหนด origin ที่อนุญาต
  methods: 'OPTIONS',
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/vdos', vdoRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/students', stdRouters);
app.use('/api/stat', statRouters);
app.use('/api/dash', dashRouters);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
db.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Unable to connect to the database:', err));
