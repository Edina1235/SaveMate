import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Goals } from 'src/app/core/enums/goals.enum';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {
  public goals = Object.values(Goals);
  public goalsForm: FormGroup = new FormGroup({
    other: new FormControl(''),
    otherName: new FormControl(''),
    amount: new FormControl('')
  });

  constructor(private questionsService: QuestionsService) {
    this.fillFormGroup();
    this.setOtherValue();
  }

  ngOnInit(): void {
      if(this.questionsService.goals) {
        this.goalsForm.get('amount')?.setValue(this.questionsService.goals.targetAmount);
        for(let i = 0; i < this.questionsService.goals.target.length; i++) {
          if(this.goals.includes(this.questionsService.goals.target[i] as Goals)) {
            const index = this.goals.findIndex(g => g === this.questionsService.goals?.target[i]);
            this.goalsForm.get('goal'+index)?.setValue(true);

          }
          else {
            this.goalsForm.get('other')?.setValue(true);
            this.goalsForm.get('otherName')?.setValue(this.questionsService.goals.target[i]);
          }
        }
      }
  }

  private fillFormGroup() {
    for(let i = 0; i < this.goals.length; i++) {
      this.goalsForm.addControl('goal'+i, new FormControl(''));
    }
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
      if(this.goalsForm.get(controlName)?.value 
         && this.goalsForm.get('amount')?.value) 
         returnValue = true;
    });
    return returnValue;
  }

  private setGoalTarget() {
    const amount = this.goalsForm.get('amount')?.value;
    const targets = [];
    for(let i = 0; i < this.goals.length; i++) {
      if(this.goalsForm.get('goal'+i)?.value) {
        targets.push(this.goals[i]);
      }
    }

    if(this.goalsForm.get('other')?.value 
       && this.goalsForm.get('otherName')?.value) {
      targets.push(this.goalsForm.get('otherName')?.value);
    }
    this.questionsService.setGoalTarget(targets, amount);
  }

  public onClickNext() {
    this.setGoalTarget();
    this.questionsService.activeStep = QuestionSteps.GoalDeadline;
  }

  public onClickPrevious() {
    this.setGoalTarget();
    this.questionsService.activeStep = QuestionSteps.SavedAmount;
  }
}
