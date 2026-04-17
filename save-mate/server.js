const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const alertsRoutes = require("./server/alerts-query");
const configurationRoutes = require("./server/configuration-query");
const contactMessageRoutes = require("./server/contactMessages-query");
const debtsRoutes = require("./server/debts-query");
const expensesRoutes = require("./server/expenses-query");
const goalsRoutes = require("./server/goals-query");
const incomeRoutes = require("./server/income-query");
const knowledgeBaseRoutes = require("./server/knowledgeBase-query");
const notificationsRoutes = require("./server/notifications-query");
const recurringExpensesRoutes = require("./server/recurringExpenses-query");
const savedAmountRoutes = require("./server/savedAmount-query");
const usersRoutes = require("./server/users-query");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a helpful assistant in the SaveMate application. Only give advice related to saving money and personal finance. Do not recommend other apps or unrelated services." },
        { role: "user", content: question }
      ]
    });

    const text = response.choices[0]?.message?.content || "";
    res.json({ reply: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI hiba" });
  }
});

app.use("/alerts", alertsRoutes);
app.use("/configuration", configurationRoutes);
app.use("/contact-messages", contactMessageRoutes);
app.use("/debts", debtsRoutes);
app.use("/expenses", expensesRoutes);
app.use("/goals", goalsRoutes);
app.use("/income", incomeRoutes);
app.use("/knowledge-base", knowledgeBaseRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/recurring-expenses", recurringExpensesRoutes);
app.use("/saved-amount", savedAmountRoutes);
app.use("/users", usersRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});