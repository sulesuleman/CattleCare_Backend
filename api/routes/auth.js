const express = require("express");
const router = express.Router();
const { signUpUser, loginUser, forgetPassword, resetPassword } = require("./../controllers/auth.controller");

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
module.exports = router;
