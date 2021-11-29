const express = require("express");
const router = express.Router();




const { createAnimals, getAllAnimals, getAllUserAnimals, getSpecificAnimalById, deleteAnimal, updateAnimal } = require("./../controllers/animal.controller");
const { authMiddle } = require('../middleware/auth.middleware');
const { send } = require('../middleware/uploadAttachment.middleware');

router.get("/all", authMiddle, getAllAnimals);
router.get("/", authMiddle, getAllUserAnimals);
router.get("/:cattleId", authMiddle, getSpecificAnimalById);
router.post("/create", authMiddle, send, createAnimals);
router.put("/delete/:cattleId", authMiddle, deleteAnimal);
router.put("/update/:id", authMiddle, send, updateAnimal);
module.exports = router