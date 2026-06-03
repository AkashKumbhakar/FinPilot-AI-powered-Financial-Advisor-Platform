const express = require("express");
const recurringController = require("../controllers/recurringController");
const authCheck = require("../middlewares/authMiddleaware");



const router = express.Router();



router.post("/create",authCheck,recurringController.createRecurring);
router.get("/all",authCheck,recurringController.getAllRecurring);
router.get("/enums", authCheck,recurringController.getRecurringEnums);
router.post("/execute",recurringController.executeRecurringTransactions);
router.delete("/delete/:id",authCheck,recurringController.deleteRecurring);


module.exports = router;