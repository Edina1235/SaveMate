import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-goal-deadline',
  templateUrl: './goal-deadline.component.html',
  styleUrls: ['./goal-deadline.component.scss']
})
export class GoalDeadlineComponent implements OnInit {
  public goalDeadline: FormGroup = new FormGroup({
    deadline: new FormControl('short'),
    years: new FormControl('')
  });

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
      if(this.questionsService.goals) {
        this.goalDeadline.get('years')?.setValue(this.questionsService.goalDeadlineYear);
      }
  }
  
  public onClickNext() {
    this.questionsService.setGoalDeadline(this.years);
    this.questionsService.activeStep = QuestionSteps.RecurringExpenses;
  }

  public onClickPrevious() {
    this.questionsService.setGoalDeadline(this.years);
    this.questionsService.activeStep = QuestionSteps.Goals;
  }

  public get years() {
    return this.goalDeadline.get('years')?.value;
  }
}
