const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', require('./routes/authRoutes'));
// app.use('/api/hoteladmin', require('./routes/hoteladmin/index'));
// app.use('/api/superadmin', require('./routes/superadmin/index'));
// app.use('/api/hoteladmin', require('./routes/hoteladmin/index'));
// app.use('/api/apk', require('./routes/apk/index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
