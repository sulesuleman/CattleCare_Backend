const express = require("express");
const router = express.Router();
const { createAnimals, getAllAnimals, deleteAnimal, updateAnimal } = require("./../controllers/animal.controller");
const { authMiddle } = require('../middleware/auth.middleware');
const { send } = require('../middleware/uploadAttachment.middleware');



router.get("/all", authMiddle, getAllAnimals);
router.post("/create", authMiddle, send, createAnimals);
router.put("/delete/:cattleId", authMiddle, deleteAnimal);
router.put("/update/:id", authMiddle, updateAnimal);
// router.post("/unsubscribe", authCtrl.unSubscribe);
// router.post("/forget-password", authCtrl.forgetPassword);
// router.post("/reset-password", authCtrl.resetPassword);

module.exports = router;
