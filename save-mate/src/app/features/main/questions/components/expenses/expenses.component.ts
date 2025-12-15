import { Component } from '@angular/core';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {
  public activeCategories: SpendingCategoriesName[] = [];

  constructor(private questionsService: QuestionsService) {}

  public onClickNext() {
    this.questionsService.activeStep = QuestionSteps.PreviousMonthExpenses;
  }

  public setActiveCategories(categories: SpendingCategoriesName[]) {
    this.activeCategories = categories;
  }
}
