import { Injectable } from '@angular/core';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { Debt } from 'src/app/core/models/debt';
import { DebtInput } from 'src/app/core/models/debt-input';
import { Expense } from 'src/app/core/models/expense';
import { ExpenseInput } from 'src/app/core/models/expense-input';
import { Goal } from 'src/app/core/models/goal';
import { Income } from 'src/app/core/models/income';
import { RecurringExpense } from 'src/app/core/models/recurring-expense';
import { SavedAmount } from 'src/app/core/models/saved-amont';
import { User } from 'src/app/core/models/user';
import { DebtService } from 'src/app/core/services/debt.service';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { GoalService } from 'src/app/core/services/goal.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { RecurringExpenseService } from 'src/app/core/services/recurring-expense.service';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  public activeStep: QuestionSteps = QuestionSteps.Income;
  public income?: Income;
  public goals?: Goal;
  public expenses: Expense[] = [];
  public recurringExpenses: RecurringExpense[] = [];
  public debts: Debt[] = [];
  public incomes: Income[] = [];
  public user!: User;
  public goalDeadlineYear: number = 0;
  public savedAmount?: SavedAmount;

  constructor(private userService: UserService,
              private incomeService: IncomeService,
              private goalsService: GoalService,
              private expensesService: ExpenseService,
              private debtService: DebtService,
              private savedAmountService: SavedAmountService,
              private recurringExpenseService: RecurringExpenseService
  ) { }

  public setIncome(amount: number) {
    this.income = {
      id: '',
      userId: this.user.id,
      amount: amount,
      date: new Date(),
      source: 'Fizetés'
    };
  }

  public setIncomes(incomes: Income[]) {
    this.incomes = [];
    incomes.forEach(income => {
      this.incomes.push({
        userId: this.user.id,
        id: income.id,
        amount: income.amount,
        date: income.date,
        source: income.source
      });
    });
  }

  public setGoalSavedAmount(savedAmount: number) {
    this.savedAmount = {
      id: '',
      userId: this.user.id,
      amount: savedAmount,
      date: new Date()
    };
  }

  public setGoalTarget(target: string[], amount: number) {
    this.goals!.target = target;
    this.goals!.targetAmount = amount;
  }

  public setGoalDeadline(years: number) {
    this.goalDeadlineYear = years;
    const deadline = this.getDateWithPlus(years);
    this.goals!.deadline = deadline;
  }

  public setRecurringExpenses(categories: SpendingCategoriesName[], amount: number) {
    this.user.fixSpendingCategories = categories;
    this.user.avgMonthlyFixedCosts = amount;
  }

  public setTopSpendingCategories(categories: SpendingCategoriesName[]) {
    this.user.topSpendingCategories = categories;
  }

  public setExpenses(expenseInputs: ExpenseInput[]) {
    if(expenseInputs.length === 0 || [0, ""].includes(expenseInputs[0].amount)) return;
    const previousMonthDate = new Date();
    this.expenses = [];
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    expenseInputs.forEach((expenseInput) => {
      if(this.user.fixSpendingCategories.includes(expenseInput.category)) {
        this.recurringExpenses.push({
          id: '',
          userId: this.user.id,
          category: expenseInput.category,
          amount: expenseInput.amount,
          date: new Date()
        });
      } else {
        this.expenses.push({
          id: '',
          userId: this.user.id,
          amount: expenseInput.amount,
          category: expenseInput.category,
          date: previousMonthDate
        });
      }
    });
  }

  public setExpensesCsv(expenses: Expense[]) {
    this.expenses = [];
    expenses.forEach(expense => {
      if(this.user.fixSpendingCategories.includes(expense.category as SpendingCategoriesName)) {
        this.recurringExpenses.push({
          userId: this.user.id,
          id: expense.id,
          amount: expense.amount,
          category: expense.category,
          date: expense.date
        });
      } else {
        this.expenses.push({
          userId: this.user.id,
          id: expense.id,
          amount: expense.amount,
          category: expense.category,
          date: expense.date
        });
      }
    });
  }

  public setDebts(debtInputs: DebtInput[]) {
    this.debts = [];
    debtInputs.forEach((debtInput) => {
      const years = debtInput.totalAmount / debtInput.monthlyPayment;
      this.debts.push({
        id: '',
        userId: this.user.id,
        name: debtInput.name,
        totalAmount: debtInput.totalAmount,
        paidAmount: debtInput.paidAmount,
        monthlyPayment: debtInput.monthlyPayment,
        interest: debtInput.interest,
        dueDate: this.getDateWithPlus(years),
        hasArrears: false,
        prepaymentAllowed: false
      })
    });
  }

  public setDebtsHasArrears(name: string, hasArrears: boolean) {
    this.debts.forEach(debt => {
      if(debt.name === name) debt.hasArrears = hasArrears;
    });
  }

  public finish() {
    this.updateUser();
    this.addExpenses();
    this.addRecurringExpenses();
    this.addDebts();
    this.addGoal();
    this.addIncome();
    this.setSavedAmount();
  }

  private setSavedAmount() {
    if(this.savedAmount)
    this.savedAmountService.setSavedAmount(this.savedAmount).subscribe({error: error => console.error(error)});
  }

  private updateUser() {
    this.userService.updateUser(this.user.id, this.user).subscribe({error: error => console.error(error)});
  }

  private addExpenses() {
    this.expenses.forEach(expense => {
      this.expensesService.setExpense(expense).subscribe({error: error => console.error(error)});
    });
  }

  private addRecurringExpenses() {
    this.recurringExpenses.forEach(expense => {
      this.recurringExpenseService.setRecurringExpense(expense).subscribe({error: error => console.error(error)});
    });
  }

  private addDebts() {
    this.debts.forEach(debt => {
      this.debtService.setDebt(debt).subscribe({error: error => console.error(error)});
    });
  }

  private addGoal() {
    if(this.goals)
      this.goalsService.setGoal(this.goals).subscribe({error: error => console.error(error)});
  }

  private addIncome() {
    if(this.income)
      this.incomeService.setIncome(this.income).subscribe({error: error => console.error(error)});
    
    if(this.incomes)
      this.incomes.forEach(income => {
        this.incomeService.setIncome(income).subscribe({error: error => console.error(error)});
      });
  }

  private getDateWithPlus(years: number): Date {
    const date = new Date();
    const plusYears = Math.floor(years);
    const plusMonths = (years - plusYears) * 12;
    date.setMonth(date.getMonth() + plusMonths);
    date.setFullYear(date.getFullYear() + plusYears);
    return date;
  }
}
