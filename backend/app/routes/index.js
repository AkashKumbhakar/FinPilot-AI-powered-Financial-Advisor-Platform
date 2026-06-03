const express=require('express');

const router=express.Router();

const authRoute=require('./authRoute')
const userRoute=require('./userRoute')
const expenseRoute=require('./expenseRoute')
const incomeRoute=require('./incomeRoute')
const budgetRoute=require('./budgetRoute')
const recurringRoute=require('./recurringRoute')
const goalRoutes = require("./goalRoute");
const notificationRoute=require('./notificationRoute')
const reportRoute=require('./reportRoute')
const subscriptionRoute=require('./subscriptionRoute')
const aiRoute=require('./aiRoute')
const adminRoute=require('./adminRoute')

router.use('/auth',authRoute)
router.use('/user',userRoute)
router.use('/expense',expenseRoute)
router.use('/income',incomeRoute)
router.use('/budget',budgetRoute)
router.use('/recurring',recurringRoute)
router.use("/goal", goalRoutes)
router.use('/notification',notificationRoute)
router.use('/report',reportRoute)
router.use('/subscription',subscriptionRoute)
router.use('/ai',aiRoute)

router.use('/admin',adminRoute)

module.exports=router