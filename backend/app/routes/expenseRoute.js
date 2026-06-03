const express = require("express");
const authCheck = require("../middlewares/authMiddleaware");
const expenseController = require("../controllers/expenseController");

const router = express.Router();

router.post("/create",authCheck,expenseController.createExpense);
router.get("/all",authCheck,expenseController.getAllExpenses);
router.get("/monthly-analytics",authCheck,expenseController.monthlyExpenseAnalytics);
router.get("/last-6-months",authCheck,expenseController.lastSixMonthsExpense);
router.get("/dashboard-summary",authCheck,expenseController.dashboardSummary);
router.get("/:id",authCheck,expenseController.getSingleExpense);
router.put("/update/:id",authCheck,expenseController.updateExpense);
router.delete("/delete/:id",authCheck,expenseController.deleteExpense);



module.exports = router;