const express = require('express');
const router = express.Router();

const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');

const { verifyToken } = require('../middleware/authMiddleware');

// כל הפעולות פתוחות לכל משתמש שמחובר
router.get('/', verifyToken, getAllRooms);
router.get('/:id', verifyToken, getRoomById);
router.post('/', verifyToken, createRoom);
router.put('/:id', verifyToken, updateRoom);
router.delete('/:id', verifyToken, deleteRoom);

module.exports = router;
 