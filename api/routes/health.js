const express = require("express");
const router = express.Router();
const {
    getAnimalMedicalHistory,
    createAnimalMedicalRecord,
    // deleteAnimalMedicalRecord,
    // updateAnimalMedicalRecord,
} = require("./../controllers/health.controller");
const { authMiddle } = require("../middleware/auth.middleware");

router.get("/all", authMiddle, getAnimalMedicalHistory);
router.post("/create", authMiddle, createAnimalMedicalRecord);
// router.put("/delete/:id", authMiddle, deleteAnimalMedicalRecord);
// router.put("/update/:id", authMiddle, updateAnimalMedicalRecord);

module.exports = router;
