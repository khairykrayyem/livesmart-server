const Room = require('../models/roomModel');
const Device = require('../models/deviceModel'); 

// שליפת כל החדרים – תמיד כולל devices
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    const roomIds = rooms.map(r => r._id);

    // מביאים את כל המכשירים של כל החדרים במכה אחת
    const devices = await Device.find({ roomId: { $in: roomIds } })
                                .select('name type status roomId');

    // מקבצים לפי roomId
    const byRoom = new Map();
    for (const d of devices) {
      const k = String(d.roomId);
      if (!byRoom.has(k)) byRoom.set(k, []);
      byRoom.get(k).push({ _id: d._id, name: d.name, type: d.type, status: d.status });
    }

    // משיבים כל חדר עם devices
    const withDevices = rooms.map(r => ({
      ...r.toObject(),
      devices: byRoom.get(String(r._id)) || []
    }));

    res.json(withDevices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// שליפת חדר לפי ID – תמיד כולל devices
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const devices = await Device.find({ roomId: room._id })
                                .select('name type status');

    res.json({
      ...room.toObject(),
      devices: devices.map(d => ({ _id: d._id, name: d.name, type: d.type, status: d.status }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// יצירת חדר חדש (ללא שינוי)
const createRoom = async (req, res) => {
  try {
    const { name, floor, type } = req.body;
    const room = new Room({ name, floor, type });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// עדכון חדר קיים (ללא שינוי)
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// מחיקת חדר (ללא שינוי)
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};
