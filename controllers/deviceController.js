const Device = require('../models/deviceModel');

// Get all devices
const getDevices = async (req, res) => {
  const devices = await Device.find();
  res.json(devices);
};

// Create new device
const createDevice = async (req, res) => {
  const { name, room, status, type } = req.body;
  const device = new Device({ name, room, status, type });
  await device.save();
  res.status(201).json(device);
};

module.exports = { getDevices, createDevice };
