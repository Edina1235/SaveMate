import { Component } from '@angular/core';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { QuestionsService } from './questions.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {
  public QuestionSteps = QuestionSteps;

  constructor(private questionsService: QuestionsService) {

  }

  public get activeStep() {
    return this.questionsService.activeStep;
  }
}
