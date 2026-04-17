import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { ExpenseInput } from 'src/app/core/models/expense-input';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { Income } from 'src/app/core/models/income';
import { Expense } from 'src/app/core/models/expense';

@Component({
  selector: 'app-previous-month-expenses',
  templateUrl: './previous-month-expenses.component.html',
  styleUrls: ['./previous-month-expenses.component.scss']
})
export class PreviousMonthExpensesComponent implements OnInit {
  public expenses: ExpenseInput[] = [];
  public validForm: boolean = false;

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
      if(this.questionsService.expenses) {
        this.expenses = [];
        for(let i = 0; i < this.questionsService.expenses.length; i++) {
          this.expenses.push({
            category: this.questionsService.expenses[i].category as SpendingCategoriesName,
            amount: this.questionsService.expenses[i].amount});
        }
      }
  }

  public setExpenses(expenses: ExpenseInput[]) {
    this.expenses = expenses;
    this.questionsService.setExpenses(expenses);
  }

  public setExpensesCsv(expenses: Expense[]) {
    this.questionsService.setExpensesCsv(expenses);
  }

  public setIncomes(incomes: Income[]) {
    this.questionsService.setIncomes(incomes);
  }

  public setValidForm(isValid: boolean) {
    this.validForm = isValid;
  }
  
  public onClickNext() {
    this.questionsService.setExpenses(this.expenses);
    this.questionsService.activeStep = QuestionSteps.DebtQuestion;
  }

  public onClickPrevious() {
    this.questionsService.setExpenses(this.expenses);
    this.questionsService.activeStep = QuestionSteps.Expenses;
  }
}
