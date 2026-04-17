import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

@Component({
  selector: 'app-prepayment',
  templateUrl: './prepayment.component.html',
  styleUrls: ['./prepayment.component.scss']
})
export class PrepaymentComponent implements OnInit {
  public debtsGroup: FormGroup = new FormGroup({});

  constructor(private router: Router,
              private questionService: QuestionsService) {
    this.fillFormGroup();
  }

  ngOnInit(): void {
    if(this.questionService.debts)
      for(let i = 0; i < this.debts.length; i++) {
        this.debtsGroup.get('debt'+i)?.setValue(this.debts[i].prepaymentAllowed);
      }
  }

  private fillFormGroup() {
    for(let i = 0; i < this.debts.length; i++) {
      this.debtsGroup.addControl('debt'+i, new FormControl(false));
    }
  }

  private setCheckedPrepayments() {
    for(let i = 0; i < this.debts.length; i++) {
      if(this.debtsGroup.get('debt'+i)?.value) {
        this.debts[i].prepaymentAllowed = true;
      }
      this.debts[i].prepaymentAllowed = false;
    }
  }

  public onClickFinish() {
    this.setCheckedPrepayments();
    this.questionService.finish();
    this.router.navigateByUrl(AppUrl.Home);
  }

  public onClickPrevious() {
    this.setCheckedPrepayments();
    this.questionService.activeStep = QuestionSteps.DebtDelay;
  }

  public get debts() {
    return this.questionService.debts;
  }
}
