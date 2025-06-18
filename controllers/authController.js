const jwt = require("jsonwebtoken");
const Device = require("../models/Device");

exports.registerDevice = async (req, res, next) => {
  try {
    const { deviceId, name, password } = req.body;
    const existing = await Device.findOne({ deviceId });
    if (existing) return res.status(400).json({ message: "Device already exists" });

    const device = new Device({ deviceId, name, password });
    await device.save();

    res.status(201).json({ message: "Device registered" });
  } catch (err) {
    next(err);
  }
};

exports.loginDevice = async (req, res, next) => {
  try {
    const { deviceId, password } = req.body;
    const device = await Device.findOne({ deviceId });

    if (!device || password !== device.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ deviceId: device.deviceId }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
