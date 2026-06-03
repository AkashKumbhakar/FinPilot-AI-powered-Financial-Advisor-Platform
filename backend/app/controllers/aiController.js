const Expense = require("../models/Expense");
const Income = require("../models/Income");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL:
    "https://api.groq.com/openai/v1",
});

class AiController {
  //AI INSIGHT
  async aiInsights(req, res) {
    try {
      const userId = req.user._id;
      const expenses = await Expense.find({ user: userId });
      const income = await Income.find({ user: userId });

      const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);

      const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);

      const insights = [];

      // Savings insight
      const savings = totalIncome - totalExpense;

      if (savings > 50000) {
        insights.push("Excellent savings performance this month.");
      }

      // Expense ratio
      if (totalExpense > totalIncome * 0.7) {
        insights.push("Your expenses are above 70% of your income.");
      }

      // Category insight
      const foodExpenses = expenses.filter((e) => e.category === "Food");

      const totalFood = foodExpenses.reduce(
        (acc, item) => acc + item.amount,
        0,
      );

      if (totalFood > 10000) {
        insights.push("Food expenses are significantly high.");
      }

      // Default
      if (insights.length === 0) {
        insights.push("Your finances look stable this month.");
      }

      return res.status(200).json({
        success: true,

        insights,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }
  //FINANCIAL SCORE
  async financialScore(req, res) {
    try {
      const expenses = await Expense.find({ user: req.user._id });
      const incomes = await Income.find({ user: req.user._id });

      const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);

      const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);

      let score = 100;

      const expenseRatio = totalExpense / totalIncome;

      if (expenseRatio > 0.8) {
        score -= 30;
      }

      if (expenseRatio > 0.6) {
        score -= 15;
      }

      const savings = totalIncome - totalExpense;

      if (savings > 50000) {
        score += 5;
      }

      let status = "Poor";

      if (score >= 80) {
        status = "Excellent";
      } else if (score >= 60) {
        status = "Good";
      } else if (score >= 40) {
        status = "Average";
      }
      return res.status(200).json({
        success: true,
        score,
        status,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  //
  async spendingAnalysis(req, res) {

  try {

    const userId = req.user._id;

    const expenses =
      await Expense.find({
        user: userId,
      });

    const incomes =
      await Income.find({
        user: userId,
      });

    const totalExpense =
      expenses.reduce(
        (acc, item) =>
          acc + item.amount,
        0
      );

    const totalIncome =
      incomes.reduce(
        (acc, item) =>
          acc + item.amount,
        0
      );

    const savings =
      totalIncome - totalExpense;

    const expenseRatio =
      totalIncome > 0
        ? (
            (totalExpense /
              totalIncome) *
            100
          ).toFixed(1)
        : 0;

    let status = "Good";

    if (expenseRatio > 80) {

      status = "Critical";

    } else if (
      expenseRatio > 60
    ) {

      status = "Warning";
    }

    return res.status(200).json({

      success: true,

      totalExpense,

      totalIncome,

      savings,

      expenseRatio,

      status,
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,
    });
  }
}

  async savingsTips(req, res) {
    try {
      const userId = req.user._id;

      // FETCH DATA

      const expenses = await Expense.find({
        user: userId,
      });

      const incomes = await Income.find({
        user: userId,
      });

      // TOTALS

      const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);

      const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);

      const savings = totalIncome - totalExpense;

      const tips = [];

      // EXPENSE RATIO

      if (totalExpense > totalIncome * 0.8) {
        tips.push(
          "Your expenses are above 80% of your income. Try reducing unnecessary spending.",
        );
      }

      // SAVINGS HEALTH

      if (savings < 10000) {
        tips.push(
          "Your monthly savings are low. Aim to save at least 20% of your income.",
        );
      }

      // FOOD EXPENSE ANALYSIS

      const foodExpense = expenses
        .filter((item) => item.category === "Food")
        .reduce((acc, item) => acc + item.amount, 0);

      if (foodExpense > 10000) {
        tips.push(
          "Food expenses are high. Consider reducing online food orders and dining out.",
        );
      }

      // SHOPPING ANALYSIS

      const shoppingExpense = expenses
        .filter((item) => item.category === "Shopping")
        .reduce((acc, item) => acc + item.amount, 0);

      if (shoppingExpense > 15000) {
        tips.push(
          "Shopping expenses are significantly high. Focus on planned purchases.",
        );
      }

      // INVESTMENT TIP

      if (savings > 20000) {
        tips.push(
          "You have healthy savings. Consider investing in SIPs or mutual funds.",
        );
      }

      // EMERGENCY FUND

      if (savings > 0) {
        tips.push(
          "Build an emergency fund covering at least 6 months of expenses.",
        );
      }

      // DEFAULT TIP

      if (tips.length === 0) {
        tips.push(
          "Your finances look balanced. Maintain consistent savings habits.",
        );
      }

      return res.status(200).json({
        success: true,

        totalIncome,

        totalExpense,

        savings,

        tips,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }
  async monthlyPrediction(req, res) {
    try {
      const userId = req.user._id;

      const currentDate = new Date();

      const currentMonth = currentDate.getMonth() + 1;

      const currentYear = currentDate.getFullYear();

      // START OF MONTH

      const startDate = new Date(currentYear, currentMonth - 1, 1);

      // END OF MONTH

      const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

      // FETCH CURRENT MONTH EXPENSES

      const expenses = await Expense.find({
        user: userId,
        expenseDate: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      // FETCH CURRENT MONTH INCOME

      const incomes = await Income.find({
        user: userId,
        incomeDate: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      // TOTALS

      const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);

      const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);

      // DAYS CALCULATION

      const today = currentDate.getDate();

      const totalDays = new Date(currentYear, currentMonth, 0).getDate();

      const remainingDays = totalDays - today;

      // DAILY AVERAGE SPENDING

      const averageDailyExpense = totalExpense / today;

      // PREDICTED MONTH END EXPENSE

      const predictedExpense = Math.round(averageDailyExpense * totalDays);

      // PREDICTED SAVINGS

      const predictedSavings = totalIncome - predictedExpense;

      // STATUS

      let status = "Stable";

      if (predictedExpense > totalIncome * 0.8) {
        status = "High Spending";
      }

      if (predictedSavings < 0) {
        status = "Overspending Risk";
      }

      // RESPONSE

      return res.status(200).json({
        success: true,
        currentMonth,
        currentYear,
        totalIncome,
        currentExpense: totalExpense,
        averageDailyExpense: Math.round(averageDailyExpense),
        predictedExpense,
        predictedSavings,
        remainingDays,
        status,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
   async aiChat(req, res) {

    try {

      const { message } = req.body;

      if (!message) {

        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      const completion =
        await client.chat.completions.create({

          model:
            "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",

              content: `
              You are an AI Financial Advisor.

              Help users with:
              - budgeting
              - saving money
              - expense management
              - investment basics
              - SIP suggestions
              - financial discipline

              Keep answers short,
              smart and professional.
              `,
            },

            {
              role: "user",
              content: message,
            },
          ],

          temperature: 0.7,

          max_tokens: 300,
        });

      const reply =
        completion.choices[0]
          .message.content;

      return res.status(200).json({
        success: true,

        reply,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }
}

module.exports = new AiController();
