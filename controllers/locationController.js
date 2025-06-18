const Location = require("../models/Location");
const Device = require("../models/Device");
const { isInsideGeofence } = require("../utils/geofence"); // Geofencing utility

// Example geofence around New Delhi
const GEOFENCE = {
  centerLat: 28.6139,
  centerLng: 77.2090,
  radiusMeters: 500 // 500 meters
};

// POST /api/locations
exports.addLocation = async (req, res, next) => {
  try {
    const { deviceId, latitude, longitude, timestamp } = req.body;

    // Validate device
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ message: "Device not registered" });
    }

    // Save new location
    const location = await Location.create({
      deviceId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timestamp
    });

    const io = req.app.get("io");

    // Emit real-time location update
    io.emit("locationUpdate", {
      deviceId,
      latitude,
      longitude,
      timestamp
    });

    // Geofence check
    const inside = isInsideGeofence(latitude, longitude, GEOFENCE);

    io.emit("geofenceAlert", {
      deviceId,
      latitude,
      longitude,
      timestamp,
      inside,
      alert: inside
        ? "✅ Device inside geofence"
        : "🚨 Device exited geofence"
    });

    res.status(201).json({ location });
  } catch (err) {
    next(err);
  }
};

// GET /api/locations/history/:deviceId?from=&to=
exports.getLocationHistory = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { from, to } = req.query;

    const filter = { deviceId };
    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to) filter.timestamp.$lte = new Date(to);
    }

    const history = await Location.find(filter).sort({ timestamp: 1 });
    res.json(history);
  } catch (err) {
    next(err);
  }
};

// GET /api/locations/latest/:deviceId
exports.getLatestLocation = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    const latest = await Location.findOne({ deviceId }).sort({ timestamp: -1 });
    if (!latest) {
      return res.status(404).json({ message: "No location data found" });
    }

    res.json(latest);
  } catch (err) {
    next(err);
  }
};
