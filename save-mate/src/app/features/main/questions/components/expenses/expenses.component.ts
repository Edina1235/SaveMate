import { Component, OnInit } from '@angular/core';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  public activeCategories: SpendingCategoriesName[] = [];

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
      if(this.questionsService.user) {
        this.activeCategories = this.questionsService.user.topSpendingCategories;
      }
  }

  public onClickNext() {
    this.questionsService.setTopSpendingCategories(this.activeCategories);
    this.questionsService.activeStep = QuestionSteps.PreviousMonthExpenses;
  }

  public onClickPrevious() {
    this.questionsService.setTopSpendingCategories(this.activeCategories);
    this.questionsService.activeStep = QuestionSteps.RecurringExpenses;
  }

  public setActiveCategories(categories: SpendingCategoriesName[]) {
    this.activeCategories = categories;
  }
}
