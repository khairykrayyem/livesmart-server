const Device = require('../models/deviceModel');

// Get all devices
const getDevices = async (req, res) => {
const devices = await Device.find().populate('roomId');
  res.json(devices);

};

// ררשליפת מכשירים לפי חדר
const getDevicesByRoom = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const devices = await Device.find({ roomId });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// יציירתת מכשיר חדש
const createDevice = async (req, res) => {
  const { name, roomId, status, type } = req.body;

  try {
    const device = new Device({ name, roomId, status, type });
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = { getDevices,getDevicesByRoom, createDevice };
