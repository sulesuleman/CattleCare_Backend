const express = require("express");
const router = express.Router();

const {
    createAnimals,
    bulkCreateAnimals,
    getAllAnimals,
    getAllUserAnimals,
    uploadEarTag,
    getSpecificAnimalById,
    deleteAnimal,
    updateAnimal,
    addDailyAnimalYield,
    getAllUserDailyAnimalsFeed
} = require("./../controllers/animal.controller");
const { authMiddle } = require("../middleware/auth.middleware");
const {
    ImgMiddle,
    csvMiddle,
} = require("../middleware/uploadAttachment.middleware");
const { ProcessmiddleWare } = require("../middleware/processImage.middleware");

router.get("/", authMiddle, getAllUserAnimals);
router.get("/all", authMiddle, getAllAnimals);
router.post("/daily-add", authMiddle, addDailyAnimalYield);
router.post("/create", authMiddle, ImgMiddle, createAnimals);
router.get("/daily-yield", authMiddle, getAllUserDailyAnimalsFeed);
router.get("/:cattleId", authMiddle, getSpecificAnimalById);
router.post(
    "/upload-eartag",
    authMiddle,
    ImgMiddle,
    ProcessmiddleWare,
    uploadEarTag
);
router.post("/bulk-create", authMiddle, csvMiddle, bulkCreateAnimals);
router.put("/delete/:cattleId", authMiddle, deleteAnimal);
router.put("/update/:id", authMiddle, ImgMiddle, updateAnimal);
module.exports = router;
