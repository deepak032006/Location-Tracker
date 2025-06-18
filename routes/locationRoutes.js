const express = require("express");
const router = express.Router();
const {
  addLocation,
  getLocationHistory,
  getLatestLocation
} = require("../controllers/locationController");
const authenticate = require("../middlewares/authMiddleware");

router.post("/", authenticate, addLocation);
router.get("/:deviceId", authenticate, getLocationHistory);
router.get("/:deviceId/latest", authenticate, getLatestLocation);

module.exports = router;
