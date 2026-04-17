import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Papa from 'papaparse';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { Expense } from 'src/app/core/models/expense';
import { ExpenseInput } from 'src/app/core/models/expense-input';
import { Income } from 'src/app/core/models/income';

@Component({
  selector: 'app-expenses-row',
  templateUrl: './expenses-row.component.html',
  styleUrls: ['./expenses-row.component.scss']
})
export class ExpensesRowComponent implements OnInit {
  @Input() expenses: ExpenseInput[] = [];
  @Output() expensesOutput = new EventEmitter<ExpenseInput[]>();
  @Output() expensesCsvOutput = new EventEmitter<Expense[]>();
  @Output() incomes = new EventEmitter<Income[]>();
  @Output() validGroup = new EventEmitter<boolean>();
  public indexes: number[] = [];
  public fileName?: string;
  public expensesGroup: FormGroup = new FormGroup({
    csvFile: new FormControl(''),
  });

  private readonly descriptionsByCategories: Record<SpendingCategoriesName, string[]> = {
    [SpendingCategoriesName.ChildrenPerFamily]: ["gyerek", "gyermek", "child", "baby", "iskola", "school", "óvoda", "ovoda", "játék", "jatek", "pelenka", "diaper", "family", "család", "csalad"],
    [SpendingCategoriesName.ClothingAndOtherShopping]: ["Online Shopping", "IKEA", "MediaMarkt", "Decathlon"],
    [SpendingCategoriesName.EntertainmentAndLeisure]: ["Gym Membership", "Netflix", "Spotify", "Google", "Apple", "Amazon"],
    [SpendingCategoriesName.FoodAndHousehold]: ["Grocery Store", "Tesco", "Lidl", "Spar", "Aldi", "Auchan", "Penny Market", "McDonald's", "Burger King", "KFC", "Starbucks", "Costa Coffee", "Coffee Shop", "Restaurant"],
    [SpendingCategoriesName.HealthAndPersonalExpenses]: ["Pharmacy"],
    [SpendingCategoriesName.HousingAndUtilities]: ["Electricity Bill", "Water Bill", "Gas Bill", "Internet"],
    [SpendingCategoriesName.InsuranceAndFinancialProducts]: ["biztosítás", "insurance", "allianz", "generali", "groupama", "aegon", "union", "fund", "portfolio", "befektetési alap", "nyugdíjbiztosítás"],
    [SpendingCategoriesName.LoansAndDebts]: ["hitel", "loan", "credit", "törlesztés", "torlesztes", "kölcsön", "kolcson", "credit card payment", "cc payment", "debt", "installment"],
    [SpendingCategoriesName.OtherPerVariableExpenses]: ["egyéb", "egyeb", "misc", "other", "vegyes", "unknown", "ismeretlen", "payment", "purchase"],
    [SpendingCategoriesName.SavingAndInvesting]: ["megtakarítás", "megtakaritas", "saving", "investment", "invest", "revolut savings", "wise savings", "állampapír", "allampapir", "tbsz", "broker", "trading", "etf", "crypto", "binance"],
    [SpendingCategoriesName.Transportation]: ["Gas Station", "MOL", "Shell", "OMV", "MÁV"]
  }

  private readonly descriptionName: Record<string, string[]> = {
    ["Salary"]: ["Fizetés"],
    ["Freelance"]: ["Utalás"],
    ["Refund"]: ["Visszatérítés"],
  }

  public categories: SpendingCategoriesName[] = Object.values(SpendingCategoriesName);
  public categoryIcons: SpendingCategoriesIcon[] = Object.values(SpendingCategoriesIcon);

  ngOnInit(): void {
    if(this.expenses.length === 0)
      this.addNewRow();

    this.expenses.forEach(expense => {
      this.addNewRowWithData(expense);
      this.validGroup.emit(this.expensesGroup.valid);
    });

    this.expensesGroup.valueChanges.subscribe({next: () => {
      this.expensesOutput.emit(this.getExpenseInput());
      this.validGroup.emit(this.expensesGroup.valid);
    }, error: error => console.error(error)});
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.parseCSV(input.files[0]);
    }
  }

  private parseCSV(file: File) {
    const expensesCsv: Expense[] = [];
    const incomes: Income[] = [];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: any) => {
        result.data.forEach((t: any) => {
          if(["Salary", "Freelance", "Refund"].includes(t['Description']))
            incomes.push({
              id: "",
              userId: "",
              amount: Math.abs(t['Amount (HUF)']),
              date: t['Date'],
              source: this.descriptionName["Salary"][0]
            });
          else
            expensesCsv.push({
              id: "",
              userId: "",
              amount: Math.abs(t['Amount (HUF)']),
              category: this.getCategoryByDescription(t['Description']),
              date: t['Date']
            });
        });
        this.incomes.emit(incomes);
        this.expensesCsvOutput.emit(expensesCsv);
        this.validGroup.emit(true);
      }
    });
  }

  private getCategoryByDescription(description: string): SpendingCategoriesName {
    for(let i = 0; i < this.categories.length; i++) {
      if(this.descriptionsByCategories[this.categories[i]].includes(description)) {
        return this.categories[i];
      }
    }

    return SpendingCategoriesName.OtherPerVariableExpenses;
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
    this.expensesGroup.addControl('spendingCategory_'+index, new FormControl('', Validators.required));
    this.expensesGroup.addControl('cost_'+index, new FormControl('', Validators.required));
    this.setSpendingCategory(SpendingCategoriesName.HousingAndUtilities, index);
  }

  private addNewRowWithData(expenseInput: ExpenseInput) {
    const lastNumber = this.indexes[this.indexes.length-1] ?? 0;
    const index = lastNumber + 1;
    this.indexes.push(index);
    this.expensesGroup.addControl('spendingCategory_'+index, new FormControl(expenseInput.category, Validators.required));
    this.expensesGroup.addControl('cost_'+index, new FormControl(expenseInput.amount, Validators.required));
    this.setSpendingCategory(expenseInput.category, index);
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
