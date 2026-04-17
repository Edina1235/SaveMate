import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DebtInput } from 'src/app/core/models/debt-input';

@Component({
  selector: 'app-debt-rows',
  templateUrl: './debt-rows.component.html',
  styleUrls: ['./debt-rows.component.scss']
})
export class DebtRowsComponent implements OnInit, OnChanges {
  @Input() debtsInput: DebtInput[] = [];
  @Input() color: string = 'dark-green';
  @Output() debtDataChange = new EventEmitter<DebtInput[]>();
  @Output() validGroup = new EventEmitter<boolean>();
  public indexes: number[] = [];
  public debtsGroup: FormGroup = new FormGroup({});

  public totalAmount: number = 0;
  public monthlyAmount: number = 0;

  ngOnInit(): void {
    if(this.debtsInput.length === 0) {
      this.addNewRow();
    } else {
      this.totalAmount = 0;
      this.monthlyAmount = 0;
      this.debtsInput.forEach(debtInput => {
        this.totalAmount += debtInput.totalAmount;
        this.monthlyAmount += debtInput.monthlyPayment;
        this.addNewRowWithData(debtInput);
      });

      if(this.debtsGroup.valid) {
        this.validGroup.emit(true);
      } else {
        this.validGroup.emit(false);
      }
    }

    this.debtsGroup.valueChanges.subscribe({ next: (debtValue) => {
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
    }, error: error => console.error(error)});
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['debtsInput'] && JSON.stringify(changes['debtsInput'].currentValue) !== JSON.stringify(changes['debtsInput'].previousValue)) {
        Object.keys(this.debtsGroup.controls).forEach(key => {
          this.debtsGroup.removeControl(key);
        });
        this.indexes = [];
        if(this.debtsInput.length !== 0) {
          this.totalAmount = 0;
          this.monthlyAmount = 0;
          this.debtsInput.forEach(debtInput => {
            this.totalAmount += debtInput.totalAmount;
            this.monthlyAmount += debtInput.monthlyPayment;
            this.addNewRowWithData(debtInput);
          });

          if(this.debtsGroup.valid) {
            this.validGroup.emit(true);
          } else {
            this.validGroup.emit(false);
          }
        }
      }
  }

  private addNewRow() {
    const lastNumber = this.indexes[this.indexes.length-1] ?? 0;
    const index = lastNumber + 1;
    this.indexes.push(index);
    this.debtsGroup.addControl('name_' + index, new FormControl('', {validators: [Validators.required]}));
    this.debtsGroup.addControl('amount_' + index, new FormControl('', {validators: [Validators.required]}));
    this.debtsGroup.addControl('monthlyAmount_' + index, new FormControl('', {validators: [Validators.required]}));
    this.debtsGroup.addControl('paidAmount_' + index, new FormControl('', {validators: [Validators.required]}));
    this.debtsGroup.addControl('interest_' + index, new FormControl('', {validators: [Validators.required]}));
  }

  private addNewRowWithData(debtInput: DebtInput) {
    const lastNumber = this.indexes[this.indexes.length-1] ?? 0;
    const index = lastNumber + 1;
    this.indexes.push(index);
    this.debtsGroup.addControl('name_' + index, new FormControl(debtInput.name, {validators: [Validators.required]}));
    this.debtsGroup.addControl('amount_' + index, new FormControl(debtInput.totalAmount, {validators: [Validators.required]}));
    this.debtsGroup.addControl('monthlyAmount_' + index, new FormControl(debtInput.monthlyPayment, {validators: [Validators.required]}));
    this.debtsGroup.addControl('paidAmount_' + index, new FormControl(debtInput.paidAmount, {validators: [Validators.required]}));
    this.debtsGroup.addControl('interest_' + index, new FormControl(debtInput.interest, {validators: [Validators.required]}));
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

  public getPaidAmountByIndex(index: number) {
    return this.debtsGroup.get('paidAmount_'+index)?.value;
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
        interest: this.getInterestByIndex(index),
        paidAmount: this.getPaidAmountByIndex(index)
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
