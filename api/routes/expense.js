const express = require("express");
const router = express.Router();
const { addExpense, getExpenses, getProfitLoss } = require("./../controllers/expense.controller");
const { authMiddle } = require('../middleware/auth.middleware');
router.post("/add", authMiddle, addExpense);
router.get("/", authMiddle, getExpenses);
router.get("/economy", authMiddle, getProfitLoss);

module.exports = router;
