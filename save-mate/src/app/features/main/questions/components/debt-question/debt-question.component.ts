import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { QuestionsService } from '../../questions.service';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debt-question',
  templateUrl: './debt-question.component.html',
  styleUrls: ['./debt-question.component.scss']
})
export class DebtQuestionComponent {
  public debtQuestionGroup: FormGroup = new FormGroup({
    debt: new FormControl('no')
  });

  constructor(private questionsService: QuestionsService,
              private router: Router) {}

  public onClickNext() {
    this.questionsService.activeStep = QuestionSteps.Debts;
  }

  public onClickFinish() {
    this.router.navigateByUrl(AppUrl.Home);
  }

  public get debt() {
    return this.debtQuestionGroup.get('debt')?.value;
  }
}
