const express = require("express");
const router = express.Router();

const { createFeed, getAllFeedsofOwner, deleteFeedById, updateFeedById, addDailyFeed, getAllUserDailyFeed } = require("../controllers/feed.controller");
const { authMiddle } = require('../middleware/auth.middleware');
// const { send } = require('../middleware/uploadAttachment.middleware');

router.get("/", authMiddle, getAllFeedsofOwner);
router.post("/create", authMiddle, createFeed);
router.put("/delete/:feedId", authMiddle, deleteFeedById);
router.put("/update/:id", authMiddle, updateFeedById);
router.put("/update/:id", authMiddle, updateFeedById);
router.post("/daily-add", authMiddle, addDailyFeed);
router.get("/daily", authMiddle, getAllUserDailyFeed);

module.exports = router