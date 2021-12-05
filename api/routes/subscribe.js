const express = require("express");
const router = express.Router();

const { subscribePackage ,getAllPackagesofOwner} = require("./../controllers/subscribe.controller");
const { authMiddle } = require('../middleware/auth.middleware');
// const { send } = require('../middleware/uploadAttachment.middleware');

router.post("/charge", authMiddle, subscribePackage);
router.get("/", authMiddle, getAllPackagesofOwner);
module.exports = router