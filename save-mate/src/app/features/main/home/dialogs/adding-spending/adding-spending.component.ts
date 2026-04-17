import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HeaderService } from 'src/app/core/components/header/header.service';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { Expense } from 'src/app/core/models/expense';
import { ExpenseInput } from 'src/app/core/models/expense-input';
import { Income } from 'src/app/core/models/income';
import { RecurringExpense } from 'src/app/core/models/recurring-expense';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { RecurringExpenseService } from 'src/app/core/services/recurring-expense.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-adding-spending',
  templateUrl: './adding-spending.component.html',
  styleUrls: ['./adding-spending.component.scss']
})
export class AddingSpendingComponent {
  public expensesInput: ExpenseInput[] = [];
  public expenses: Expense[] = [];
  public recurringExpenses: RecurringExpense[] = [];
  public incomes: Income[] = [];
  public validForm: boolean = false;

  constructor(private dialogRef: MatDialogRef<AddingSpendingComponent>,
              @Inject(MAT_DIALOG_DATA) 
              public data: string,
              private headerService: HeaderService,
              private incomeService: IncomeService,
              private expenseService: ExpenseService,
              private recurringExpenseService: RecurringExpenseService,
              private toastService: ToastService
  ) {}

  public setExpenses(expenses: ExpenseInput[]) {
    this.expensesInput = expenses;
    this.addExpenses(expenses);
  }

  public setExpensesCsv(expenses: Expense[]) {
    this.addExpensesCsv(expenses);
  }

  public setIncomes(incomes: Income[]) {
    this.addIncomes(incomes);
  }

  public setValidForm(isValid: boolean) {
    this.validForm = isValid;
  }

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {
    this.incomes.forEach(income => {
      this.incomeService.setIncome(income).subscribe({error: error => console.error(error)});
    });

    this.expenses.forEach(expense => {
      this.expenseService.setExpense(expense).subscribe({error: error => console.error(error)});
      if(this.recurringExpenses.length === 0 && this.expenses[this.expenses.length-1].date === expense.date
        && this.expenses[this.expenses.length-1].amount === expense.amount
      ) {
        this.toastService.successToastr("Siker", "Sikeres mentés");
        this.dialogRef.close();
      }
    });

    this.recurringExpenses.forEach(recurringExpense => {
      this.recurringExpenseService.setRecurringExpense(recurringExpense).subscribe({ error: error => console.error(error)});
      if(this.recurringExpenses[this.recurringExpenses.length-1].date === recurringExpense.date
        && this.recurringExpenses[this.recurringExpenses.length-1].amount === recurringExpense.amount
      ) {
        this.toastService.successToastr("Siker", "Sikeres mentés");
        this.dialogRef.close();
      }
    });
  }

  private addExpenses(expenseInputs: ExpenseInput[]) {
    if(expenseInputs.length === 0 || [0, ""].includes(expenseInputs[0].amount)) return;
      const previousMonthDate = new Date();
      this.expenses = [];
      previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
      expenseInputs.forEach((expenseInput) => {
        if(this.user!.fixSpendingCategories.includes(expenseInput.category)) {
          this.recurringExpenses.push({
            id: '',
            userId: this.user!.id,
            category: expenseInput.category,
            amount: expenseInput.amount,
            date: new Date()
          });
        } else {
          this.expenses.push({
            id: '',
            userId: this.user!.id,
            amount: expenseInput.amount,
            category: expenseInput.category,
            date: previousMonthDate
          });
        }
      });
    }
  
  private addExpensesCsv(expenses: Expense[]) {
      this.expenses = [];
      expenses.forEach(expense => {
        if(this.user!.fixSpendingCategories.includes(expense.category as SpendingCategoriesName)) {
          this.recurringExpenses.push({
            userId: this.user!.id,
            id: expense.id,
            amount: expense.amount,
            category: expense.category,
            date: expense.date
          });
        } else {
          this.expenses.push({
            userId: this.user!.id,
            id: expense.id,
            amount: expense.amount,
            category: expense.category,
            date: expense.date
          });
        }
      });
    }

  private addIncomes(incomes: Income[]) {
    this.incomes = [];
    incomes.forEach(income => {
      this.incomes.push({
        userId: this.user!.id,
        id: income.id,
        amount: income.amount,
        date: income.date,
        source: income.source
      });
    });
  }

  private get user() {
    return this.headerService.user;
  }
}
