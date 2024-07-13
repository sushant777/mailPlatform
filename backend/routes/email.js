const express = require("express");
const { jwtCheck } = require("../middleware/auth");
const { inbox, send, webhookOutLook } = require("../controllers/email");

const router = express.Router();

router.get("/inbox", jwtCheck, inbox);
router.post("/send", jwtCheck, send);
router.post("/webhookOutLook", webhookOutLook);

module.exports = router;
