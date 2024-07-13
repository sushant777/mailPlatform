const express = require("express");
const { jwtCheck } = require("../middleware/auth");
const { profile } = require("../controllers/user");

const router = express.Router();

router.get("/", jwtCheck, profile);

module.exports = router;
