const express = require("express");
const goalController = require("../controllers/goalController");
const authCheck = require("../middlewares/authMiddleaware");

const router = express.Router();

router.post("/create",authCheck,goalController.createGoal);
router.get("/all",authCheck,goalController.getAllGoals);
router.put("/add-saving/:id",authCheck,goalController.addSaving);
router.put("/update/:id",authCheck,goalController.updateGoal);
router.delete("/delete/:id",authCheck,goalController.deleteGoal);

module.exports = router;