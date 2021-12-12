const express = require("express");
const router = express.Router();

const {
    getAllFarmerStats,
    getAllAdminStats,
    getProfile,
    deleteUser,
    updateUser,
    blockUnblockUser,
    getAllUsers,
} = require("./../controllers/user.controller");
const { authMiddle } = require("../middleware/auth.middleware");
// const { send } = require('../middleware/uploadAttachment.middleware');

router.get("/farmer/stats", authMiddle, getAllFarmerStats);
router.get("/admin/stats", getAllAdminStats);
router.get("/all", getAllUsers);
router.get("/me", authMiddle, getProfile);
router.post("/update", authMiddle, updateUser);
router.put("/delete", deleteUser);
router.post("/block-unblock", blockUnblockUser);
module.exports = router;
