const express = require('express');
const router = express.Router();

const {
  getDevices,
  createDevice,
  getDevicesByRoom,
  updateDevice,
  deleteDevice
} = require('../controllers/deviceController');

const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// שליפת כל המכשירים
router.get('/', verifyToken, getDevices);

// שליפת מכשירים לפי חדר
router.get('/room/:roomId', verifyToken, getDevicesByRoom);

// יצירת מכשיר – רק ADMIN
router.post('/', verifyToken /*, requireAdmin*/, createDevice);

// עדכון מכשיר – רק ADMIN
router.put('/:id', verifyToken, requireAdmin, updateDevice);

// מחיקת מכשיר – רק ADMIN
router.delete('/:id', verifyToken, requireAdmin, deleteDevice);

module.exports = router;
