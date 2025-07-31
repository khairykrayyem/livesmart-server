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

////////////////////////////////////////////////////////////////////////////////////
// === Weather API (חיצוני: Open-Meteo) ===
app.get('/api/weather', async (req, res) => {                               
  try {
    let { city, lat, lon } = req.query;                                     

    if (!lat || !lon) {                                                      // אם לא נתנו קואורדינטות
      if (!city) return res.status(400).json({ message: 'Provide ?city= or ?lat=&lon=' }); // דרוש עיר או lat/lon
      const gRes = await fetch(                                              // קריאת Geocoding לחיפוש עיר
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      const gData = await gRes.json();                                       // JSON של תוצאת הגיאוקודינג
      if (!gData.results?.length) return res.status(404).json({ message: 'City not found' }); // לא נמצאה עיר
      lat = gData.results[0].latitude;                                       
      lon = gData.results[0].longitude;                                      
      city = gData.results[0].name;                                      
    }

    const wRes = await fetch(                                                // קריאת מזג אוויר לפי lat/lon
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
    );
    if (!wRes.ok) return res.status(502).json({ message: 'Weather provider error' }); // שגיאת ספק חיצוני
    const w = await wRes.json();                                             // JSON של מזג האוויר

    return res.json({                                                         // תשובה פשוטה ללקוח
      city: city || undefined,                                               // שם העיר אם ניתן
      lat: Number(lat),                                                      // לט נומרי
      lon: Number(lon),                                                      // לון נומרי
      temperature: w.current_weather?.temperature,                           // הטמפרטורה כרגע
      unit: '°C',                                                            // יחידות (Open-Meteo מחזיר ב-°C)
      wind: w.current_weather?.windspeed                                     // מהירות רוח (אופציונלי)
    });
  } catch (err) {                                                             // תפיסת שגיאה כללית
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
////////////////////////////////////////////////////////////////////////////////////

// ראוטים
const deviceRoutes = require('./routes/deviceRoutes');
app.use('/api/devices', deviceRoutes);

//חדרים 
const roomRoutes = require('./routes/roomRoutes');
app.use('/api/rooms', roomRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const deviceRequestRoutes = require('./routes/deviceRequestRoutes');
app.use('/api/device-requests', deviceRequestRoutes); 

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
