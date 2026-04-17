import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { DebtInput } from 'src/app/core/models/debt-input';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss']
})
export class DebtsComponent implements OnInit {
  public isValidGroup: boolean = false;
  public debtInputs: DebtInput[] = [];

  constructor(private questionsService: QuestionsService) { }

  ngOnInit(): void {
    if(this.questionsService.debts) {
      this.debtInputs = [];
      this.questionsService.debts.forEach(debt => {
        this.debtInputs.push({
          name: debt.name,
          totalAmount: debt.totalAmount,
          monthlyPayment: debt.monthlyPayment,
          interest: debt.interest,
          paidAmount: debt.paidAmount
        });
      });
    }
  }

  public invalidChange(event: boolean) {
    this.isValidGroup = event;
  }

  public dataChange(event: DebtInput[]) {
    this.debtInputs = event;
  }

  public onClickNext() {
    this.questionsService.setDebts(this.debtInputs);
    this.questionsService.activeStep = QuestionSteps.DebtDelay;
  }

  public onClickPrevious() {
    this.questionsService.setDebts(this.debtInputs);
    this.questionsService.activeStep = QuestionSteps.DebtQuestion;
  }
}
