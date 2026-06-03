const express = require("express");
const budgetController = require("../controllers/budgetController");
const authCheck = require("../middlewares/authMiddleaware");



const router = express.Router();


router.post("/create",authCheck,budgetController.createBudget);
router.get("/all",authCheck,budgetController.getAllBudgets);
router.get("/tracking",authCheck,budgetController.budgetTracking);
router.put("/update/:id",authCheck,budgetController.updateBudget);
router.delete("/delete/:id",authCheck,budgetController.deleteBudget);

module.exports = router;