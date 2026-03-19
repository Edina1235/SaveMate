import { Component } from '@angular/core';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { ExpenseInput } from 'src/app/core/models/expense-input';

@Component({
  selector: 'app-previous-month-expenses',
  templateUrl: './previous-month-expenses.component.html',
  styleUrls: ['./previous-month-expenses.component.scss']
})
export class PreviousMonthExpensesComponent {
  public expenses: ExpenseInput[] = [];
  public validForm: boolean = false;

  constructor(private questionsService: QuestionsService) {}

  public setExpenses(expenses: ExpenseInput[]) {
    this.expenses = expenses;
  }

  public setValidForm(isValid: boolean) {
    this.validForm = isValid;
  }
  
  public onClickNext() {
    this.questionsService.setExpenses(this.expenses);
    this.questionsService.activeStep = QuestionSteps.DebtQuestion;
  }

  public onClickPrevious() {
    this.questionsService.activeStep = QuestionSteps.Expenses;
  }
}
