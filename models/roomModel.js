

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  floor: { type: Number, required: true },
  type: { type: String, enum: ['bedroom', 'kitchen', 'living room', 'bathroom', 'other'], default: 'other' }
}, {
  timestamps: true,
  toJSON:   { virtuals: true },   // יאפשר להחזיר devices רק כשמבצעים populate
  toObject: { virtuals: true }
});

// Virtual populate: כל המכשירים ששדה roomId שלהם = _id של החדר
roomSchema.virtual('devices', {
  ref: 'Device',
  localField: '_id',
  foreignField: 'roomId'
});


module.exports = mongoose.model('Room', roomSchema);