const express = require("express");
const router = express.Router();
const { registerDevice, loginDevice } = require("../controllers/authController");

router.post("/register", registerDevice);
router.post("/login", loginDevice);

module.exports = router;
