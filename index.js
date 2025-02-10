const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Routes
const adminRoutes = require('./routes/adminRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const docRoutes = require('./routes/docRoutes');
const vdoRoutes = require('./routes/vdoRoutes');
const newsRoutes = require('./routes/newsRoutes');
const linksRoutes = require('./routes/linksRouter');
const stdRouters = require('./routes/stdRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000','http://localhost:5173', 'https://lawstd.rmu.ac.th'],
  methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true,
}));

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
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

// Error Handling Middleware
app.use(errorHandler);

// Start Server
db.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Unable to connect to the database:', err));
