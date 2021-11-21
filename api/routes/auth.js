const express = require("express");
const router = express.Router();
const authCtrl = require("./../controllers/auth.controller");

router.post("/signup", authCtrl.signUpUser);
router.post("/login", authCtrl.loginUser);
// router.post("/contact", authCtrl.contact);
// router.post("/unsubscribe", authCtrl.unSubscribe);
// router.post("/forget-password", authCtrl.forgetPassword);
// router.post("/reset-password", authCtrl.resetPassword);

module.exports = router;
