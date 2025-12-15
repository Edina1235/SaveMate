import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Goals } from 'src/app/core/enums/goals.enum';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent {
  public goals = Object.values(Goals);
  public goalsForm: FormGroup = new FormGroup({
    other: new FormControl(''),
    otherName: new FormControl(''),
  });

  constructor(private questionsService: QuestionsService) {
    this.fillFormGroup();
    this.setOtherValue();
  }

  private fillFormGroup() {
    let index = 0;
    this.goals.forEach(goal => {
      this.goalsForm.addControl('goal'+index, new FormControl(''));
      index++;
    });
  }

  private setOtherValue() {
    this.goalsForm.get('otherName')!.valueChanges.subscribe((value) => {
      if(value !== '') this.goalsForm.get('other')!.setValue(true);
      else this.goalsForm.get('other')!.setValue(false);
    })
  }

  public isButtonActive() {
    let returnValue = false;
    Object.keys(this.goalsForm.controls).forEach(controlName => {
      if(this.goalsForm.get(controlName)?.value) returnValue = true;
    });
    return returnValue;
  }

  public onClickNext() {
    this.questionsService.activeStep = QuestionSteps.GoalDeadline;
  }
}
