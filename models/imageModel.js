const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  imageData: {
    type: Buffer,
    required: true
  }
  // You can add additional fields like image metadata (e.g., filename, timestamp, etc.)
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
