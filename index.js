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

//חדרים 
const roomRoutes = require('./routes/roomRoutes');
app.use('/api/rooms', roomRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.get('/health', async (req, res) => {
  const startedAt = Date.now();

  // Mongoose readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  let dbStatus = stateMap[mongoose.connection.readyState] || 'unknown';

  // If connected, try a real ping to ensure DB is responsive
  if (mongoose.connection.readyState === 1) {
    try {
      await mongoose.connection.db.admin().command({ ping: 1 });
      dbStatus = 'connected';
    } catch (e) {
      dbStatus = 'unresponsive';
    }
  }

  const healthy = dbStatus === 'connected';
  const payload = {
    status: healthy ? 'ok' : 'degraded',
    db: dbStatus,
    uptime_seconds: Math.round(process.uptime()),
    responseTimeMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
  };

  res.status(healthy ? 200 : 503).json(payload);
});

// ברירת מחדל
app.get('/', (req, res) => {
  res.send('LiveSmart server is running');
  console.log("HI!");
});

// הרצת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
