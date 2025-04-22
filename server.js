const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const path = require('path');
dotenv.config();
const app = express();
app.use(cors());

// ✅ Set limits BEFORE routes and only once
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Static folder to access uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectDB();

app.use('/api', require('./routes/authRoutes'));
app.use('/api/superadmin', require('./routes/superadmin/index'));
app.use('/api/hoteladmin', require('./routes/hoteladmin/index'));
// app.use('/api/apk', require('./routes/apk/index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
