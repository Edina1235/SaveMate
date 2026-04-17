import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-recurring-expenses',
  templateUrl: './recurring-expenses.component.html',
  styleUrls: ['./recurring-expenses.component.scss']
})
export class RecurringExpensesComponent implements OnInit {
  public recurringExpensesGroup: FormGroup = new FormGroup({
    avg: new FormControl('')
  });
  public activeCategories: SpendingCategoriesName[] = [];

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
    if(this.questionsService.user) {
      this.activeCategories = this.questionsService.user.fixSpendingCategories;
      this.recurringExpensesGroup.get('avg')?.setValue(this.questionsService.user.avgMonthlyFixedCosts);
    }
  }
  
  public onClickNext() {
    this.questionsService.setRecurringExpenses(this.activeCategories, this.avg);
    this.questionsService.activeStep = QuestionSteps.Expenses;
  }

  public onClickPrevious() {
    this.questionsService.setRecurringExpenses(this.activeCategories, this.avg);
    this.questionsService.activeStep = QuestionSteps.GoalDeadline;
  }

  public get avg() {
    return this.recurringExpensesGroup.get('avg')?.value;
  }

  public setActiveCategories(categories: SpendingCategoriesName[]) {
    this.activeCategories = categories;
  }
}
