import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { DebtInput } from 'src/app/core/models/debt-input';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss']
})
export class DebtsComponent {
  public isValidGroup: boolean = false;
  public debtInputs: DebtInput[] = [];

  constructor(private questionsService: QuestionsService) { }

  public invalidChange(event: boolean) {
    this.isValidGroup = event;
  }

  public dataChange(event: DebtInput[]) {
    this.debtInputs = event;
  }

  public onClickNext() {
    this.questionsService.setDebts(this.debtInputs);
    this.questionsService.activeStep = QuestionSteps.DebtDelay;
  }

  public onClickPrevious() {
    this.questionsService.activeStep = QuestionSteps.DebtQuestion;
  }
}
