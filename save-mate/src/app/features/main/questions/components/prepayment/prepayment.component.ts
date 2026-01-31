import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from '../../questions.service';

@Component({
  selector: 'app-prepayment',
  templateUrl: './prepayment.component.html',
  styleUrls: ['./prepayment.component.scss']
})
export class PrepaymentComponent {
  public debtsGroup: FormGroup = new FormGroup({});

  constructor(private router: Router,
              private questionService: QuestionsService) {
    this.fillFormGroup();
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
    }
  }

  public onClickFinish() {
    this.setCheckedPrepayments();
    this.router.navigateByUrl(AppUrl.Home);
  }

  public get debts() {
    return this.questionService.debts;
  }
}
