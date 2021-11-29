const express = require("express");
const router = express.Router();
const {
    getAllAnimalMedicalHistory,
    getMedicalHistoryOfAnimal,
    createAnimalMedicalRecord,
    deleteAnimalMedicalRecord,
    updateAnimalMedicalRecord,
} = require("./../controllers/health.controller");
const { authMiddle } = require("../middleware/auth.middleware");

router.get("/all", authMiddle, getAllAnimalMedicalHistory);
router.get("/:cattleId", authMiddle, getMedicalHistoryOfAnimal);
router.post("/create", authMiddle, createAnimalMedicalRecord);
router.put("/delete/:healthId", authMiddle, deleteAnimalMedicalRecord);
router.put("/update/:id", authMiddle, updateAnimalMedicalRecord);

module.exports = router;
