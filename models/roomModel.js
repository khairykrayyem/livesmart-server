

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  floor: { type: Number, required: true },
  type: { type: String, enum: ['bedroom', 'kitchen', 'living room', 'bathroom', 'other'], default: 'other' }
});

module.exports = mongoose.model('Room', roomSchema);