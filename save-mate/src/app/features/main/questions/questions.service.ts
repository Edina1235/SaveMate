import { Injectable } from '@angular/core';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { Debt } from 'src/app/core/models/debt';
import { DebtInput } from 'src/app/core/models/debt-input';
import { Expense } from 'src/app/core/models/expense';
import { ExpenseInput } from 'src/app/core/models/expense-input';
import { Goal } from 'src/app/core/models/goal';
import { Income } from 'src/app/core/models/income';
import { User } from 'src/app/core/models/user';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  public activeStep: QuestionSteps = QuestionSteps.Income;
  private income?: Income;
  private goals?: Goal;
  private expenses: Expense[] = [];
  public debts: Debt[] = [];

  constructor() { }

  public setIncome(amount: number) {
    this.income = {
      id: '',
      userid: this.user.id,
      amount: amount,
      date: new Date(),
      source: 'fizetés'
    };
  }

  public setGoalSavedAmount(savedAmount: number) {
    this.goals = {
      id: '',
      userId: this.user.id,
      target: [],
      targetAmount: 0,
      savedAmount: savedAmount,
      deadline: new Date()
    };
  }

  public setGoalTarget(target: string[], amount: number) {
    this.goals!.target = target;
    this.goals!.targetAmount = amount;
  }

  public setGoalDeadline(years: number) {
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
    const previousMonthDate = new Date();
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    expenseInputs.forEach((expenseInput) => {
      this.expenses.push({
        id: '',
        userId: this.user.id,
        amount: expenseInput.amount,
        category: expenseInput.category,
        date: previousMonthDate
      });
    });
  }

  public setDebts(debtInputs: DebtInput[]) {
    debtInputs.forEach((debtInput) => {
      const years = debtInput.totalAmount / debtInput.monthlyPayment;
      this.debts.push({
        id: '',
        userId: this.user.id,
        name: debtInput.name,
        totalAmount: debtInput.totalAmount,
        monthlyPayment: debtInput.monthlyPayment,
        interest: debtInput.interest,
        dueDate: this.getDateWithPlus(years),
        hasArrears: false,
        prepaymentAllowed: false
      })
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

  private get user() {
    return {
      id: '',
      email: '',
      firstname: '',
      lastname: '',
      nickname: '',
      passwordHash: '',
      avatarId: null,
      registrationDate: new Date(),
      lastLoginDate: new Date(),
      globalNotificationsLastSeenAt: new Date(),
      isGlobalNotificationsEnabled: true,
      topSpendingCategories: [],
      fixSpendingCategories: [],
      avgMonthlyFixedCosts: 1
    } as User;
  }
}
