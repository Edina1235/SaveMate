import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-recurring-expenses',
  templateUrl: './recurring-expenses.component.html',
  styleUrls: ['./recurring-expenses.component.scss']
})
export class RecurringExpensesComponent {
  public recurringExpensesGroup: FormGroup = new FormGroup({
    avg: new FormControl('')
  });
  public activeCategories: SpendingCategoriesName[] = [];

  constructor(private questionsService: QuestionsService) {}
  
  public onClickNext() {
    this.questionsService.activeStep = QuestionSteps.Expenses;
  }

  public get avg() {
    return this.recurringExpensesGroup.get('avg')?.value;
  }

  public setActiveCategories(categories: SpendingCategoriesName[]) {

  }
}
