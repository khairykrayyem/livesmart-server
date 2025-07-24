const Room = require('../models/roomModel');

// קבלת כל החדרים
const getRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

// יצירת חדר חדש
const createRoom = async (req, res) => {
  const { name, floor, type } = req.body;
  const room = new Room({ name, floor, type });
  await room.save();
  res.status(201).json(room);
};

module.exports = { getRooms, createRoom };
