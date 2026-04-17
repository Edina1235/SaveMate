import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-saved-amount',
  templateUrl: './saved-amount.component.html',
  styleUrls: ['./saved-amount.component.scss']
})
export class SavedAmountComponent implements OnInit {
  public savedAmountGroup = new FormGroup({
    savedAmount: new FormControl('')
  });
  
  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
      if(this.questionsService.goals) {
        this.savedAmountGroup.get('savedAmount')?.setValue(`${this.questionsService.savedAmount}`);
      }
  }

  public onClickNext() {
    this.questionsService.setGoalSavedAmount(Number(this.savedAmount));
    this.questionsService.activeStep = QuestionSteps.Goals;
  }

  public onClickPrevious() {
    this.questionsService.setGoalSavedAmount(Number(this.savedAmount));
    this.questionsService.activeStep = QuestionSteps.Income;
  }

  public get savedAmount() {
    return this.savedAmountGroup.get('savedAmount')?.value;
  }
}
