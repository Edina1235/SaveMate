import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-saved-amount',
  templateUrl: './saved-amount.component.html',
  styleUrls: ['./saved-amount.component.scss']
})
export class SavedAmountComponent {
  public savedAmountGroup = new FormGroup({
    savedAmount: new FormControl('')
  });
  
  constructor(private questionsService: QuestionsService) {}

  public onClickNext() {
    this.questionsService.activeStep = QuestionSteps.Goals;
  }

  public get savedAmount() {
    return this.savedAmountGroup.get('savedAmount')?.value;
  }
}
