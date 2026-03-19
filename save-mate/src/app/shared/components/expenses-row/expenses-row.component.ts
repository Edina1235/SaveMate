import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { ExpenseInput } from 'src/app/core/models/expense-input';

@Component({
  selector: 'app-expenses-row',
  templateUrl: './expenses-row.component.html',
  styleUrls: ['./expenses-row.component.scss']
})
export class ExpensesRowComponent implements OnInit {
  @Input() expenses: ExpenseInput[] = [];
  @Output() expensesOutput = new EventEmitter<ExpenseInput[]>();
  @Output() validGroup = new EventEmitter<boolean>();
  public indexes: number[] = [];
  public fileName?: string;
  public expensesGroup: FormGroup = new FormGroup({
    csvFile: new FormControl(''),
  });

  public categories: SpendingCategoriesName[] = Object.values(SpendingCategoriesName);
  public categoryIcons: SpendingCategoriesIcon[] = Object.values(SpendingCategoriesIcon);

  constructor() {
    this.addNewRow();
  }

  ngOnInit(): void {
      this.expensesGroup.valueChanges.subscribe(() => {
        this.expensesOutput.emit(this.getExpenseInput());
        this.validGroup.emit(this.expensesGroup.valid);
      });
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    }
  }

  public onClickDelete(id: number) {
    this.indexes = this.indexes.filter(index => index !== id);
    this.removeControlsById(this.expensesGroup, id);
  }

  private removeControlsById(form: FormGroup, id: number): void {
    Object.keys(form.controls)
      .filter(key => key.endsWith(`_${id}`))
      .forEach(key => form.removeControl(key));
  }

  private addNewRow() {
    const lastNumber = this.indexes[this.indexes.length-1] ?? 0;
    const index = lastNumber + 1;
    this.indexes.push(index);
    this.expensesGroup.addControl('spendingCategory_'+index, new FormControl(''));
    this.expensesGroup.addControl('cost_'+index, new FormControl(''));
    this.setSpendingCategory(SpendingCategoriesName.HousingAndUtilities, index);
  }

  public onClickNewRow() {
    this.addNewRow();
  }

  public findIndex(index: number): number {
    return this.categories.findIndex(category => category === this.getSpendingCategoryByIndex(index));
  }

  public getSpendingCategoryByIndex(index: number): SpendingCategoriesName {
    return this.expensesGroup.get('spendingCategory_'+index)?.value as SpendingCategoriesName;
  }

  public getCostByIndex(index: number) {
    return this.expensesGroup.get('cost_'+index)?.value;
  }

  public get csvFile() {
    return this.expensesGroup.get('csvFile')?.value;
  }

  private getExpenseInput() {
    const expenseInput: ExpenseInput[] = [];
    this.indexes.forEach(index => {
      expenseInput.push({
        amount: this.getCostByIndex(index),
        category: this.getSpendingCategoryByIndex(index)
      });
    });
    return expenseInput;
  }

  private setSpendingCategory(spendingCategory: SpendingCategoriesName, index: number) {
    this.expensesGroup.get('spendingCategory_'+index)?.setValue(spendingCategory);
  }
}
