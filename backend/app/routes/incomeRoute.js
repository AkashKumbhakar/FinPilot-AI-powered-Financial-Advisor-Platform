const express =require("express");
const incomeController = require("../controllers/incomeController");
const authCheck = require("../middlewares/authMiddleaware");


const router = express.Router();



router.post("/create",authCheck,incomeController.addIncome);
router.get("/all",authCheck,incomeController.getAllIncome);
router.get("/analytics/summary",authCheck,incomeController.incomeExpenseAnalytics);
router.get("/:id",authCheck,incomeController.getSingleIncome);
router.put("/update/:id",authCheck,incomeController.updateIncome);
router.delete("/delete/:id",authCheck,incomeController.deleteIncome);

module.exports = router;