const express = require("express");
const router = express.Router();
const { createAnimals, getAllAnimals, deleteAnimal, updateAnimal } = require("./../controllers/animal.controller");
const { authMiddle } = require('../middleware/auth.middleware');
const { send } = require('../middleware/uploadAttachment.middleware');



router.get("/all", authMiddle, getAllAnimals);
router.post("/create", authMiddle, send, createAnimals);
router.put("/delete/:cattleId", authMiddle, deleteAnimal);
router.put("/update/:id", authMiddle, updateAnimal);

module.exports = router;
