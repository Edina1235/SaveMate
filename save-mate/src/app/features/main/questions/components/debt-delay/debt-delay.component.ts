import { Component, OnInit } from '@angular/core';
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
    this.debtDelayGroup.valueChanges.subscribe({next: debtDelayValue => {
      let hasCheckedDebt = false;

      for(let i = 0; i < this.debts.length; i++) {
        if(debtDelayValue['debt'+i]) hasCheckedDebt = true;
      }

      if(debtDelayValue.debtDelay === 'no' && !hasCheckedDebt
         || debtDelayValue.debtDelay === 'yes' && hasCheckedDebt) 
         this.enabledButton = true;
      else this.enabledButton = false;
    }, error: error => console.error(error)});

    if(this.debts) {
      for(let i = 0; i < this.debts.length; i++) {
        this.debtDelayGroup.get('debt'+i)?.setValue(this.debts[i].hasArrears);
      }
    }
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
      this.debts[i].hasArrears = false;
    }
  }

  public onClickNext() {
    this.setCheckedDebts();
    this.questionsService.activeStep = QuestionSteps.Prepayment;
  }

  public onClickPrevious() {
    this.setCheckedDebts();
    this.questionsService.activeStep = QuestionSteps.Debts;
  }

  public get debts() {
    return this.questionsService.debts;
  }
}
