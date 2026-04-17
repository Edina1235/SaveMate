import { Injectable } from '@angular/core';
import { Alert, AlertCondition } from '../models/alert';
import { forkJoin, map } from 'rxjs';
import { ExpenseService } from './expense.service';
import { RecurringExpenseService } from './recurring-expense.service';
import { Expense } from '../models/expense';
import { SpendingCategoriesName } from '../enums/spending-categories-name.enum';
import { RecurringExpense } from '../models/recurring-expense';
import { NotificationService } from './notification.service';
import { Notification } from '../models/notification';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationSchedulerService {
  private readonly amountByCategories: Record<SpendingCategoriesName, number[]> = {
    [SpendingCategoriesName.HousingAndUtilities]: [0],
    [SpendingCategoriesName.Transportation]: [0],
    [SpendingCategoriesName.FoodAndHousehold]: [0],
    [SpendingCategoriesName.HealthAndPersonalExpenses]: [0],
    [SpendingCategoriesName.ClothingAndOtherShopping]: [0],
    [SpendingCategoriesName.EntertainmentAndLeisure]: [0],
    [SpendingCategoriesName.ChildrenPerFamily]: [0],
    [SpendingCategoriesName.LoansAndDebts]: [0],
    [SpendingCategoriesName.InsuranceAndFinancialProducts]: [0],
    [SpendingCategoriesName.SavingAndInvesting]: [0],
    [SpendingCategoriesName.OtherPerVariableExpenses]: [0]
  };

  private readonly categories: SpendingCategoriesName[] = Object.values(SpendingCategoriesName);

  constructor(private expenseService: ExpenseService,
              private recurringExpenseService: RecurringExpenseService,
              private notificationService: NotificationService,
              private toastService: ToastService
  ) { }

  public initNotification(lastLogin: Date, alert: Alert, userId: string) {
    const now = new Date();
    const targetDate = this.getDate(alert, userId);

    if(targetDate) {
      if (targetDate <= lastLogin) {
        this.triggerNotification(alert);
        return;
      }

      if (targetDate <= now) {
        this.triggerNotification(alert);
        return;
      }

      this.scheduleNotification(targetDate, alert);
    }
  }

  private getDate(alert: Alert, userId: string): Date | undefined {
    switch(alert.condition) {
      case AlertCondition.BillDueDate:
        const date = new Date();
        date.setDate(alert.conditionValue);
        return date;
      case AlertCondition.CategorySpendingLimit:
        const spendingByCategory = this.getSpendingByCategory(userId);
        if(spendingByCategory !== undefined)
          spendingByCategory.subscribe({next: () => {
            this.categories.forEach(category => {
              if(this.amountByCategories[category][0] >= alert.conditionValue) {
                this.triggerNotification(alert);
                return;
              }
            });
          }, error: error => console.error(error)});
        break;
      case AlertCondition.DailySpendingLimit:
        this.getSpendingByDay(userId)?.subscribe({next: amount => {
          if(amount >= alert.conditionValue) {
            this.triggerNotification(alert);
          }
        }, error: error => console.error(error)});
        break;
      case AlertCondition.DebtDueDate:
        const debtDate = new Date();
        debtDate.setDate(alert.conditionValue);
        return debtDate;
      case AlertCondition.MonthlySpendingLimit:
        this.getSpendingByMonth(userId)?.subscribe({next: amount => {
          if(amount >= alert.conditionValue) {
            this.triggerNotification(alert);
          }
        }, error: error => console.error(error)});
        break;
      case AlertCondition.SavingGoalProgress:
        return new Date();
      case AlertCondition.WeeklySpendingLimit:
        this.getSpendingByWeek(userId)?.subscribe({next: amount => {
          if(amount >= alert.conditionValue) {
            this.triggerNotification(alert);
          }
        }, error: error => console.error(error)});
        break;
    }
    return;
  }

  private getSpendingByCategory(userId: string) {
      return forkJoin({
        expenses: this.expenseService.getExpensesByUserId(userId),
        recurringExpenses: this.recurringExpenseService.getRecurringExpensesByUserId(userId)
      }).pipe(
          map(({ expenses, recurringExpenses }) => {
        (expenses as Expense[]).forEach(expense => {
          switch(expense.category) {
            case SpendingCategoriesName.ChildrenPerFamily:
              this.amountByCategories[SpendingCategoriesName.ChildrenPerFamily][0] += expense.amount;
              break;
            case SpendingCategoriesName.ClothingAndOtherShopping:
              this.amountByCategories[SpendingCategoriesName.ClothingAndOtherShopping][0] += expense.amount;
              break;
            case SpendingCategoriesName.EntertainmentAndLeisure:
              this.amountByCategories[SpendingCategoriesName.EntertainmentAndLeisure][0] += expense.amount;
              break;
            case SpendingCategoriesName.FoodAndHousehold:
              this.amountByCategories[SpendingCategoriesName.FoodAndHousehold][0] += expense.amount;
              break;
            case SpendingCategoriesName.HealthAndPersonalExpenses:
              this.amountByCategories[SpendingCategoriesName.HealthAndPersonalExpenses][0] += expense.amount;
              break;
            case SpendingCategoriesName.HousingAndUtilities:
              this.amountByCategories[SpendingCategoriesName.HousingAndUtilities][0] += expense.amount;
              break;
            case SpendingCategoriesName.InsuranceAndFinancialProducts:
              this.amountByCategories[SpendingCategoriesName.InsuranceAndFinancialProducts][0] += expense.amount;
              break;
            case SpendingCategoriesName.LoansAndDebts:
              this.amountByCategories[SpendingCategoriesName.LoansAndDebts][0] += expense.amount;
              break;
            case SpendingCategoriesName.OtherPerVariableExpenses:
              this.amountByCategories[SpendingCategoriesName.OtherPerVariableExpenses][0] += expense.amount;
              break;
            case SpendingCategoriesName.SavingAndInvesting:
              this.amountByCategories[SpendingCategoriesName.SavingAndInvesting][0] += expense.amount;
              break;
            case SpendingCategoriesName.Transportation:
              this.amountByCategories[SpendingCategoriesName.Transportation][0] += expense.amount;
              break;
          }
        });

        (recurringExpenses as RecurringExpense[]).forEach(recurringExpense => {
          switch(recurringExpense.category) {
            case SpendingCategoriesName.ChildrenPerFamily:
              this.amountByCategories[SpendingCategoriesName.ChildrenPerFamily][0] += recurringExpense.amount;
              break;
            case SpendingCategoriesName.ClothingAndOtherShopping:
              this.amountByCategories[SpendingCategoriesName.ClothingAndOtherShopping][0] += recurringExpense.amount;
              break;
            case SpendingCategoriesName.EntertainmentAndLeisure:
              this.amountByCategories[SpendingCategoriesName.EntertainmentAndLeisure][0] += recurringExpense.amount;
              break;
            case SpendingCategoriesName.FoodAndHousehold:
              this.amountByCategories[SpendingCategoriesName.FoodAndHousehold][0] += recurringExpense.amount;
              break;
            case SpendingCategoriesName.HealthAndPersonalExpenses:
              this.amountByCategories[SpendingCategoriesName.HealthAndPersonalExpenses][0] += recurringExpense.amount;
              break;
            case SpendingCategoriesName.HousingAndUtilities:
              this.amountByCategories[SpendingCategoriesName.HousingAndUtilities][0] += recurringExpense.amount;
              break;
            case SpendingCategoriesName.InsuranceAndFinancialProducts:
              this.amountByCategories[SpendingCategoriesName.InsuranceAndFinancialProducts][0] += recurringExpense.amount;
              break;
            case SpendingCategoriesName.LoansAndDebts:
              this.amountByCategories[SpendingCategoriesName.LoansAndDebts][0] += recurringExpense.amount;
              break;
            case SpendingCategoriesName.OtherPerVariableExpenses:
              this.amountByCategories[SpendingCategoriesName.OtherPerVariableExpenses][0] += recurringExpense.amount;
              break;
            case SpendingCategoriesName.SavingAndInvesting:
              this.amountByCategories[SpendingCategoriesName.SavingAndInvesting][0] += recurringExpense.amount;
              break;
            case SpendingCategoriesName.Transportation:
              this.amountByCategories[SpendingCategoriesName.Transportation][0] += recurringExpense.amount;
              break;
          }
        });
        return this.amountByCategories;
      })
    );
  }

  private getSpendingByDay(userId: string) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    let amount = 0;

      return forkJoin({
        expenses: this.expenseService.getExpensesByUserId(userId),
        recurringExpenses: this.recurringExpenseService.getRecurringExpensesByUserId(userId)
      }).pipe(
          map(({ expenses, recurringExpenses }) => {
            [...(expenses as Expense[]), ...(recurringExpenses as RecurringExpense[])].forEach(expense => {
              const expenseDate = new Date(expense.date);
              const expenseYear = expenseDate.getFullYear();
              const expenseMonth = expenseDate.getMonth();
              const expenseDay = expenseDate.getDate();
              if(year === expenseYear && month === expenseMonth && day === expenseDay) {
                amount += expense.amount;
              }
            });
            return amount;
          }
        )
      );
  }

  private getSpendingByWeek(userId: string) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const week = this.getWeekDates();
    const weekDays: number [] = [];
    let amount = 0;

    week.forEach(day => {
      weekDays.push(day.getDate());
    });

      return forkJoin({
        expenses: this.expenseService.getExpensesByUserId(userId),
        recurringExpenses: this.recurringExpenseService.getRecurringExpensesByUserId(userId)
      }).pipe(
          map(({ expenses, recurringExpenses }) => {
            [...(expenses as Expense[]), ...(recurringExpenses as RecurringExpense[])].forEach(expense => {
              const expenseDate = new Date(expense.date);
              const expenseYear = expenseDate.getFullYear();
              const expenseMonth = expenseDate.getMonth();
              const expenseDay = expenseDate.getDate();
              if(year === expenseYear && month === expenseMonth && weekDays.includes(expenseDay)) {
                amount += expense.amount;
              }
            });
            return amount;
          }
        )
      );
  }

  private getSpendingByMonth(userId: string) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    let amount = 0;

      return forkJoin({
        expenses: this.expenseService.getExpensesByUserId(userId),
        recurringExpenses: this.recurringExpenseService.getRecurringExpensesByUserId(userId)
      }).pipe(
          map(({ expenses, recurringExpenses }) => {
            [...(expenses as Expense[]), ...(recurringExpenses as RecurringExpense[])].forEach(expense => {
              const expenseDate = new Date(expense.date);
              const expenseYear = expenseDate.getFullYear();
              const expenseMonth = expenseDate.getMonth();
              if(year === expenseYear && month === expenseMonth) {
                amount += expense.amount;
              }
            });
            return amount;
          }
        )
      );
  }

  private scheduleNotification(targetDate: Date, alert: Alert) {
    const delay = targetDate.getTime() - Date.now();

    setTimeout(() => {
      this.triggerNotification(alert);
    }, delay);
  }

  private triggerNotification(alert: Alert) {
    const notification: Notification = {
      id: '',
      userId: alert.userId,
      title: alert.title,
      text: alert.text,
      category: alert.type,
      createdAt: new Date(),
      isRead: false
    }
    this.notificationService.setNotification(notification).subscribe({error: error => console.error(error)});
    this.toastService.infoToastr(alert.title, alert.text);
  }

  private getWeekDates(): Date[] {
    const now = new Date();
    const day = now.getDay(); // 0 = vasárnap

    // hétfő meghatározása
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(now);
    monday.setDate(diff);

    const week: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }

    return week;
  }
}
