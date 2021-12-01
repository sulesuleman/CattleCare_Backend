const express = require("express");
const router = express.Router();

const { subscribePackage } = require("./../controllers/subscribe.controller");
const { authMiddle } = require('../middleware/auth.middleware');
// const { send } = require('../middleware/uploadAttachment.middleware');

router.post("/charge", authMiddle, subscribePackage);
module.exports = router