const mongoose = require("mongoose");
const LocationSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, required: true },
});
module.exports = mongoose.model("Location", LocationSchema);