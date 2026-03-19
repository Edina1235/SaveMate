const express = require("express");
const cors = require("cors");

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
const usersRoutes = require("./server/users-query");

const app = express();

app.use(cors());
app.use(express.json());

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
app.use("/users", usersRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});