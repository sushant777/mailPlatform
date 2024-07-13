const express = require("express");
const auth = require("../controllers/auth");
const { jwtCheck } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.post("/verifyCodeOutLook", auth.verifyCodeOutLook);
router.get("/logout", jwtCheck, auth.logout);

module.exports = router;
