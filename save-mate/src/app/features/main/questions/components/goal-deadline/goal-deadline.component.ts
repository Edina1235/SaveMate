import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-goal-deadline',
  templateUrl: './goal-deadline.component.html',
  styleUrls: ['./goal-deadline.component.scss']
})
export class GoalDeadlineComponent {
  public goalDeadline: FormGroup = new FormGroup({
    deadline: new FormControl('short'),
    years: new FormControl('')
  });

  constructor(private questionsService: QuestionsService) {}
  
  public onClickNext() {
    this.questionsService.activeStep = QuestionSteps.RecurringExpenses;
  }

  public get years() {
    return this.goalDeadline.get('years')?.value;
  }
}
