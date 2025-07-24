const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();



// חיבור למסד הנתונים
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // מאפשר קבלת JSON בבקשות POST

// ראוטים
const deviceRoutes = require('./routes/deviceRoutes');
app.use('/api/devices', deviceRoutes);

const roomRoutes = require('./routes/roomRoutes');
app.use('/api/rooms', roomRoutes);


// ברירת מחדל
app.get('/', (req, res) => {
  res.send('LiveSmart server is running');
});

// הרצת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
