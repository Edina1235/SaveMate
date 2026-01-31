import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { DebtInput } from 'src/app/core/models/debt-input';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss']
})
export class DebtsComponent implements OnInit {
  public indexes: number[] = [];
  public debtsGroup: FormGroup = new FormGroup({});

  public totalAmount: number = 0;
  public monthlyAmount: number = 0;

  constructor(private questionsService: QuestionsService) {
    this.addNewRow();
  }

  ngOnInit(): void {
      this.debtsGroup.valueChanges.subscribe((debtValue) => {
        this.totalAmount = 0;
        this.monthlyAmount = 0;
        this.indexes.forEach(index => {
          this.totalAmount += debtValue['amount' + index];
          this.monthlyAmount += debtValue['monthlyAmount' + index];
        });
      });
  }

  private addNewRow() {
    const indexArrayLength = this.indexes.length;
    const index = indexArrayLength + 1;
    this.indexes.push(index);
    this.debtsGroup.addControl('name' + index, new FormControl(''));
    this.debtsGroup.addControl('amount' + index, new FormControl(''));
    this.debtsGroup.addControl('monthlyAmount' + index, new FormControl(''));
    this.debtsGroup.addControl('interest' + index, new FormControl(''));
  }

  public getNameByIndex(index: number) {
    return this.debtsGroup.get('name'+index)?.value;
  }

  public getAmountByIndex(index: number) {
    return this.debtsGroup.get('amount'+index)?.value;
  }

  public getMonthlyAmountByIndex(index: number) {
    return this.debtsGroup.get('monthlyAmount'+index)?.value;
  }

  public getInterestByIndex(index: number) {
    return this.debtsGroup.get('interest'+index)?.value;
  }

  public onClickNewRow() {
    this.addNewRow();
  }

  private getNonEmptyDebtInput() {
    const debtInput: DebtInput[] = [];
    this.indexes.forEach(index => {
      const name = this.getNameByIndex(index);
      const totalAmount = this.getAmountByIndex(index);
      const monthlyPayment = this.getMonthlyAmountByIndex(index);
      const interest = this.getInterestByIndex(index);
      if(name && totalAmount && monthlyPayment && interest)
        debtInput.push({
          name: this.getNameByIndex(index),
          totalAmount: this.getAmountByIndex(index),
          monthlyPayment: this.getMonthlyAmountByIndex(index),
          interest: this.getInterestByIndex(index)
        });
    });
    return debtInput;
  }

  public onClickNext() {
    this.questionsService.setDebts(this.getNonEmptyDebtInput());
    this.questionsService.activeStep = QuestionSteps.DebtDelay;
  }
}
