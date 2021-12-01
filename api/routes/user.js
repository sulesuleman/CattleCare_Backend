const express = require("express");
const router = express.Router();

const { getAllFarmerStats } = require("./../controllers/user.controller");
const { authMiddle } = require('../middleware/auth.middleware');
// const { send } = require('../middleware/uploadAttachment.middleware');

router.get("/farmer/stats", authMiddle, getAllFarmerStats);
// router.post("/create", authMiddle, createFeed);
// router.put("/delete/:feedId", authMiddle, deleteFeedById);
// router.put("/update/:id", authMiddle, updateFeedById);
module.exports = router