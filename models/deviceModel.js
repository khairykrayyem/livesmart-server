const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  room: { type: String, required: true },
  status: { type: String, enum: ['on', 'off'], default: 'off' },
  type: { type: String, required: true }
});

module.exports = mongoose.model('Device', deviceSchema);
