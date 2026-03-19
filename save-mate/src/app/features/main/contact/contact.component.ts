import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactCategory } from 'src/app/core/enums/contact-category.enum';
import { NotificationCategory } from 'src/app/core/enums/notification-category.enum';
import { Alert } from 'src/app/core/models/alert';
import { Configuration } from 'src/app/core/models/configuration';
import { ContactMessage } from 'src/app/core/models/contact-message';
import { Debt } from 'src/app/core/models/debt';
import { Expense } from 'src/app/core/models/expense';
import { Goal } from 'src/app/core/models/goal';
import { Income } from 'src/app/core/models/income';
import { KnowledgeBase } from 'src/app/core/models/knowledge-base';
import { Notification } from 'src/app/core/models/notification';
import { RecurringExpense } from 'src/app/core/models/recurring-expense';
import { Role, User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfigurationService } from 'src/app/core/services/configuration.service';
import { ContactMessageService } from 'src/app/core/services/contact-message.service';
import { DebtService } from 'src/app/core/services/debt.service';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { GoalService } from 'src/app/core/services/goal.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { KnowledgeBaseService } from 'src/app/core/services/knowledge-base.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RecurringExpenseService } from 'src/app/core/services/recurring-expense.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public contactCategories: ContactCategory[] = Object.values(ContactCategory);
  public selectedCategory?: ContactCategory;

  public formGroup: FormGroup = new FormGroup({
    category: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  });

  public onClickCategory(category: ContactCategory) {
    this.selectedCategory = category;
  }

  public onClickSend() {}

  constructor(private alertService: AlertService,
              private configurationService: ConfigurationService,
              private contactMessageService: ContactMessageService,
              private debtService: DebtService,
              private expenseService: ExpenseService,
              private goalService: GoalService,
              private incomeService: IncomeService,
              private knowledgeBaseService: KnowledgeBaseService,
              private notificationService: NotificationService,
              private recurringExpenseService: RecurringExpenseService,
              private userService: UserService,

  ) {}

  ngOnInit(): void {
    const alertId = "JuaJeXCQ5NMVe6qzacFr";
    const alert: Alert = {
      id: "",
      userId: "",
      type: "",
      conditions: new Map(),
      title: "",
      text: "",
      isEnabled: true,
      createdAt: new Date(),
    };
    const configurationId = "zSYWO8kubgzxcYvsYj5l";
    const configuration: Configuration = {
      paymentDay: 0,
      reminderTime: "",
      supportEmail: "",
      supportPhone: "",
      defaultTimeZone: "",
      defaultLocale: "",
    };
    const contactMessageId = "Kna5FCwE1LG7uI5jQHBE";
    const contactMessage: ContactMessage = {
      id: "",
      userId: "",
      category: "",
      message: "",
      date: new Date(),
    };
    const debtId = "u0Rk7ubZSoWbr0a6wmiM";
    const debt: Debt = {
      id: "",
      userId: "",
      name: "",
      totalAmount: 0,
      monthlyPayment: 0,
      interest: 0,
      dueDate: new Date(),
      hasArrears: true,
      prepaymentAllowed: true,
    };
    const expenseId = "HfWdlsnxKqQJjZmIzu9i";
    const expense: Expense = {
       id: "",
    userId: "",
    amount: 0,
    category: "",
    date: new Date(),
    };
    const goalId = "GWUz6NLDHFy1yb1qOUIm";
    const goal: Goal = {
      id: "",
    userId: "",
    target: [],
    targetAmount: 0,
    savedAmount: 0,
    deadline: new Date(),
    };
    const incomeId = "G5f2xqkL2352lu0chJId";
    const income: Income = {
       id: "",
    userid: "",
    amount: 0,
    date: new Date(),
    source: "",
    };
    const knowledgeBaseId = "2WcF8wuYnQk1BSDtMCzo";
    const knowledgeBase: KnowledgeBase = {
      id: "",
    title: "",
    text: "",
    updateDate: new Date(),
    resourceLink: "",
    };
    const notificationId = "6n9Clwh7r0MJcRmQ3OsD";
    const notification: Notification = {
      id: "",
          userId: "",
          title: "",
          text: "",
          category: NotificationCategory.All,
          createdAt: new Date(),
          isRead: true,
    };
    const recurringExpenseId = "7bZ6vAlZ10gXl36d4vdr";
    const recurringExpense: RecurringExpense = {
      id: "",
    userId: "",
    name: "",
    category: "",
    amount: 0,
    isAutoReminderEnabled: true,
    };
    const userId = "X5nF0V4MupPjCInFHq4y";
    const user: User = {
      id: "fghrdfhzdrtzh",
          email: "",
          firstname: "",
          lastname: "",
          nickname: "",
          passwordHash: "",
          avatarId: null,
          registrationDate: new Date(),
          lastLoginDate: new Date(),
          isGlobalNotificationsEnabled: true,
          topSpendingCategories: [],
          fixSpendingCategories: [],
          avgMonthlyFixedCosts: 0,
          role: Role.User
    };
    //user
    this.alertService.getAlert(alertId).subscribe(v => {console.log(v);});
    this.alertService.setAlert(alert).subscribe(v => {console.log(v);});
    this.alertService.getAlerts().subscribe(v => {console.log(v);});
    this.alertService.updateAlert(alertId, alert).subscribe(v => {console.log(v);});
    this.alertService.deleteAlert(alertId).subscribe(v => {console.log(v);});
    //Configuartion
    this.configurationService.getConfiguration(configurationId).subscribe(v => {console.log(v);});
    this.configurationService.setConfiguration(configuration).subscribe(v => {console.log(v);});
    this.configurationService.getConfigurations().subscribe(v => {console.log(v);});
    this.configurationService.updateConfiguration(configurationId, configuration).subscribe(v => {console.log(v);});
    this.configurationService.deleteConfiguration(configurationId).subscribe(v => {console.log(v);});
    //contactMessage
    this.contactMessageService.getContactMessage(contactMessageId).subscribe(v => {console.log(v);});
    this.contactMessageService.setContactMessage(contactMessage).subscribe(v => {console.log(v);});
    this.contactMessageService.getContactMessages().subscribe(v => {console.log(v);});
    this.contactMessageService.updateContactMessage(contactMessageId, contactMessage).subscribe(v => {console.log(v);});
    this.contactMessageService.deleteContactMessage(contactMessageId).subscribe(v => {console.log(v);});
    //debt
    this.debtService.getDebt(debtId).subscribe(v => {console.log(v);});
    this.debtService.setDebt(debt).subscribe(v => {console.log(v);});
    this.debtService.getDebts().subscribe(v => {console.log(v);});
    this.debtService.updateDebt(debtId, debt).subscribe(v => {console.log(v);});
    this.debtService.deleteDebt(debtId).subscribe(v => {console.log(v);});
    //expense
    this.expenseService.getExpense(expenseId).subscribe(v => {console.log(v);});
    this.expenseService.setExpense(expense).subscribe(v => {console.log(v);});
    this.expenseService.getExpenses().subscribe(v => {console.log(v);});
    this.expenseService.updateExpense(expenseId, expense).subscribe(v => {console.log(v);});
    this.expenseService.deleteExpense(expenseId).subscribe(v => {console.log(v);});
    //goal
    this.goalService.getGoal(goalId).subscribe(v => {console.log(v);});
    this.goalService.setGoal(goal).subscribe(v => {console.log(v);});
    this.goalService.getGoals().subscribe(v => {console.log(v);});
    this.goalService.updateGoal(goalId, goal).subscribe(v => {console.log(v);});
    this.goalService.deleteGoal(goalId).subscribe(v => {console.log(v);});
    //income
    this.incomeService.getIncome(incomeId).subscribe(v => {console.log(v);});
    this.incomeService.setIncome(income).subscribe(v => {console.log(v);});
    this.incomeService.getIncomes().subscribe(v => {console.log(v);});
    this.incomeService.updateIncome(incomeId, income).subscribe(v => {console.log(v);});
    this.incomeService.deleteIncome(incomeId).subscribe(v => {console.log(v);});
    //knowledgeBase
    this.knowledgeBaseService.getKnowledgeBase(knowledgeBaseId).subscribe(v => {console.log(v);});
    this.knowledgeBaseService.setKnowledgeBase(knowledgeBase).subscribe(v => {console.log(v);});
    this.knowledgeBaseService.getKnowledgeBases().subscribe(v => {console.log(v);});
    this.knowledgeBaseService.updateKnowledgeBase(knowledgeBaseId, knowledgeBase).subscribe(v => {console.log(v);});
    this.knowledgeBaseService.deleteKnowledgeBase(knowledgeBaseId).subscribe(v => {console.log(v);});
    //notification
    this.notificationService.getNotification(notificationId).subscribe(v => {console.log(v);});
    this.notificationService.setNotification(notification).subscribe(v => {console.log(v);});
    this.notificationService.getNotifications().subscribe(v => {console.log(v);});
    this.notificationService.updateNotification(notificationId, notification).subscribe(v => {console.log(v);});
    this.notificationService.deleteNotification(notificationId).subscribe(v => {console.log(v);});
    //recurringExpense
    this.recurringExpenseService.getRecurringExpense(recurringExpenseId).subscribe(v => {console.log(v);});
    this.recurringExpenseService.setRecurringExpense(recurringExpense).subscribe(v => {console.log(v);});
    this.recurringExpenseService.getRecurringExpenses().subscribe(v => {console.log(v);});
    this.recurringExpenseService.updateRecurringExpense(recurringExpenseId, recurringExpense).subscribe(v => {console.log(v);});
    this.recurringExpenseService.deleteRecurringExpense(recurringExpenseId).subscribe(v => {console.log(v);});
    //user
    this.userService.getUser(userId).subscribe(v => {console.log(v);});
    this.userService.setUser(user).subscribe(v => {console.log(v);});
    this.userService.getUsers().subscribe(v => {console.log(v);});
    this.userService.updateUser(userId, user).subscribe(v => {console.log(v);});
    this.userService.deleteUser(userId).subscribe(v => {console.log(v);});
  }
}
