const express = require("express");
const router = express.Router();

const { createAnimals, bulkCreateAnimals, getAllAnimals, getAllUserAnimals, getSpecificAnimalById, deleteAnimal, updateAnimal } = require("./../controllers/animal.controller");
const { authMiddle } = require('../middleware/auth.middleware');
const { ImgMiddle, csvMiddle } = require('../middleware/uploadAttachment.middleware');

router.get("/all", authMiddle, getAllAnimals);
router.get("/", authMiddle, getAllUserAnimals);
router.get("/:cattleId", authMiddle, getSpecificAnimalById);
router.post("/create", authMiddle, ImgMiddle, createAnimals);
router.post("/bulk-create", authMiddle, csvMiddle, bulkCreateAnimals);
router.put("/delete/:cattleId", authMiddle, deleteAnimal);
router.put("/update/:id", authMiddle, ImgMiddle, updateAnimal);
module.exports = router