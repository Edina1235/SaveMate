import { Injectable } from '@angular/core';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  public activeStep: QuestionSteps = QuestionSteps.Income;

  constructor() { }
}
