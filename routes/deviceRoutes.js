const express = require("express");
const router = express.Router();
const { getAllDevices } = require("../controllers/deviceController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, getAllDevices);

module.exports = router;
