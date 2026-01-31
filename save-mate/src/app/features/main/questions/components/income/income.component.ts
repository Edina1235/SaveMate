import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent {
  public incomeGroup = new FormGroup({
    income: new FormControl('')
  });

  constructor(private questionsService: QuestionsService) {}
  
  public onClickNext() {
    this.questionsService.setIncome(Number(this.income));
    this.questionsService.activeStep = QuestionSteps.SavedAmount;
  }

  public get income() {
    return this.incomeGroup.get('income')?.value;
  }
}
