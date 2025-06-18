const Device = require("../models/Device");

exports.getAllDevices = async (req, res, next) => {
  try {
    const devices = await Device.find({}, "-password");
    res.json(devices);
  } catch (err) {
    next(err);
  }
};
