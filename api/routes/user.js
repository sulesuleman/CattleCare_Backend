const express = require("express");
const router = express.Router();

const { getAllFarmerStats, getProfile, deleteUser, updateUser } = require("./../controllers/user.controller");
const { authMiddle } = require('../middleware/auth.middleware');
// const { send } = require('../middleware/uploadAttachment.middleware');

router.get("/farmer/stats", authMiddle, getAllFarmerStats);
router.get("/me", authMiddle, getProfile);
router.post("/update", authMiddle, updateUser);
router.put("/delete", authMiddle, deleteUser);
// router.put("/update/:id", authMiddle, updateFeedById);
module.exports = router