const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { createAnimals, getAllAnimals, deleteAnimal, updateAnimal,getAllAnimalsByUserId,getAllAnimalsByAnimalId } = require("./../controllers/animal.controller");
=======
const { createAnimals, getAllAnimals, getAllUserAnimals, getSpecificAnimalById, deleteAnimal, updateAnimal } = require("./../controllers/animal.controller");
>>>>>>> 19451415bbb73e7bc182f9327161e85d6e135f4a
const { authMiddle } = require('../middleware/auth.middleware');
const { send } = require('../middleware/uploadAttachment.middleware');



router.get("/all", authMiddle, getAllAnimals);
router.get("/", authMiddle, getAllUserAnimals);
router.get("/:cattleId", authMiddle, getSpecificAnimalById);
router.post("/create", authMiddle, send, createAnimals);
router.put("/delete/:cattleId", authMiddle, deleteAnimal);
router.put("/update/:id", authMiddle, updateAnimal);
router.get("/getByUserId/:ownerId", authMiddle, getAllAnimalsByUserId);
router.get("/getByAnimalId/:animalId", authMiddle, getAllAnimalsByAnimalId);
module.exports = router;
