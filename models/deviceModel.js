const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  status: { type: String, enum: ['on', 'off'], default: 'off' },
  type: { type: String, required: true }
});

module.exports = mongoose.model('Device', deviceSchema);
