import { Component, OnInit } from '@angular/core';
import { Debt } from 'src/app/core/models/debt';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-debt-delay',
  templateUrl: './debt-delay.component.html',
  styleUrls: ['./debt-delay.component.scss']
})
export class DebtDelayComponent implements OnInit {
  public debtDelayGroup: FormGroup = new FormGroup({
    debtDelay: new FormControl('no')
  });
  public enabledButton: boolean = false;

  constructor(private questionsService: QuestionsService) {
    this.fillFormGroup();
  }

  ngOnInit(): void {
    this.setEnabledButton();
    this.debtDelayGroup.valueChanges.subscribe(debtDelayValue => {
      let hasCheckedDebt = false;

      for(let i = 0; i < this.debts.length; i++) {
        if(debtDelayValue['debt'+i]) hasCheckedDebt = true;
      }

      if(debtDelayValue.debtDelay === 'no' && !hasCheckedDebt
         || debtDelayValue.debtDelay === 'yes' && hasCheckedDebt) 
         this.enabledButton = true;
      else this.enabledButton = false;
    });
  }

  private setEnabledButton() {
    
      let hasCheckedDebt = false;

      for(let i = 0; i < this.debts.length; i++) {
        if(this.debtDelayGroup.get('debt'+i)?.value) hasCheckedDebt = true;
      }

      if(this.debtDelayGroup.get('debtDelay')?.value === 'no' && !hasCheckedDebt
         || this.debtDelayGroup.get('debtDelay')?.value === 'yes' && hasCheckedDebt) 
         this.enabledButton = true;
      else this.enabledButton = false;
  }

  private fillFormGroup() {
    let index = 0;
    this.debts.forEach(debt => {
      this.debtDelayGroup.addControl('debt'+index, new FormControl(false));
      index++;
    });
  }

  private setCheckedDebts() {
    for(let i = 0; i < this.debts.length; i++) {
      if(this.debtDelayGroup.get('debt'+i)?.value)
        this.debts[i].hasArrears = true;
    }
  }

  public onClickNext() {
    this.setCheckedDebts();
    this.questionsService.activeStep = QuestionSteps.Prepayment;
  }

  public get debts() {
    return this.questionsService.debts;
  }
}
