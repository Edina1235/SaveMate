import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DebtInput } from 'src/app/core/models/debt-input';

@Component({
  selector: 'app-debt-rows',
  templateUrl: './debt-rows.component.html',
  styleUrls: ['./debt-rows.component.scss']
})
export class DebtRowsComponent implements OnInit {
  @Input() debtsInput: DebtInput[] = [];
  @Input() color: string = '';
  @Output() debtDataChange = new EventEmitter<DebtInput[]>();
  @Output() validGroup = new EventEmitter<boolean>();
  public indexes: number[] = [];
  public debtsGroup: FormGroup = new FormGroup({});

  public totalAmount: number = 0;
  public monthlyAmount: number = 0;

  constructor() {
    this.addNewRow();
  }

  ngOnInit(): void {
    this.debtsGroup.valueChanges.subscribe((debtValue) => {
      this.totalAmount = 0;
      this.monthlyAmount = 0;
      this.indexes.forEach(index => {
        this.totalAmount += debtValue['amount_' + index];
        this.monthlyAmount += debtValue['monthlyAmount_' + index];
      });

      if(this.debtsGroup.valid) {
        this.debtDataChange.emit(this.getDebtInput());
        this.validGroup.emit(true);
      } else {
        this.debtDataChange.emit(this.getDebtInput());
        this.validGroup.emit(false);
      }
    });
  }

  private addNewRow() {
    const lastNumber = this.indexes[this.indexes.length-1] ?? 0;
    const index = lastNumber + 1;
    this.indexes.push(index);
    this.debtsGroup.addControl('name_' + index, new FormControl('', {validators: [Validators.required]}));
    this.debtsGroup.addControl('amount_' + index, new FormControl('', {validators: [Validators.required]}));
    this.debtsGroup.addControl('monthlyAmount_' + index, new FormControl('', {validators: [Validators.required]}));
    this.debtsGroup.addControl('interest_' + index, new FormControl('', {validators: [Validators.required]}));
  }

  public getNameByIndex(index: number) {
    return this.debtsGroup.get('name_'+index)?.value;
  }

  public getAmountByIndex(index: number) {
    return this.debtsGroup.get('amount_'+index)?.value;
  }

  public getMonthlyAmountByIndex(index: number) {
    return this.debtsGroup.get('monthlyAmount_'+index)?.value;
  }

  public getInterestByIndex(index: number) {
    return this.debtsGroup.get('interest_'+index)?.value;
  }

  public onClickNewRow() {
    this.addNewRow();
  }

  public onClickDelete(id: number) {
    this.indexes = this.indexes.filter(index => index !== id);
    this.removeControlsById(this.debtsGroup, id);
  } 

  private getDebtInput() {
    const debtInput: DebtInput[] = [];
    this.indexes.forEach(index => {
      debtInput.push({
        name: this.getNameByIndex(index),
        totalAmount: this.getAmountByIndex(index),
        monthlyPayment: this.getMonthlyAmountByIndex(index),
        interest: this.getInterestByIndex(index)
      });
    });
    return debtInput;
  }

  private removeControlsById(form: FormGroup, id: number): void {
    Object.keys(form.controls)
      .filter(key => key.endsWith(`_${id}`))
      .forEach(key => form.removeControl(key));
  }
}
