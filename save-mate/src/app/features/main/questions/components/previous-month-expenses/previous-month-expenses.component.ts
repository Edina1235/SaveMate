import { Component } from '@angular/core';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';

@Component({
  selector: 'app-previous-month-expenses',
  templateUrl: './previous-month-expenses.component.html',
  styleUrls: ['./previous-month-expenses.component.scss']
})
export class PreviousMonthExpensesComponent {
  public indexes: number[] = [];
  public fileName?: string;
  public expensesGroup: FormGroup = new FormGroup({
    csvFile: new FormControl(''),
  });

  public categories: SpendingCategoriesName[] = Object.values(SpendingCategoriesName);
  public categoryIcons: SpendingCategoriesIcon[] = Object.values(SpendingCategoriesIcon);

  constructor(private questionsService: QuestionsService) {
    this.addNewRow();
  }
  
  public onClickNext() {
    this.questionsService.activeStep = QuestionSteps.DebtQuestion;
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    }
  }

  private addNewRow() {
    const indexArrayLength = this.indexes.length;
    const index = indexArrayLength + 1;
    this.indexes.push(index);
    this.expensesGroup.addControl('spendingCategory'+index, new FormControl(''));
    this.expensesGroup.addControl('cost'+index, new FormControl(''));
    this.setSpendingCategory(SpendingCategoriesName.HousingAndUtilities, index);
  }

  public onClickNewRow() {
    this.addNewRow();
  }

  public findIndex(index: number): number {
    return this.categories.findIndex(category => category === this.getSpendingCategoryByIndex(index));
  }

  public getSpendingCategoryByIndex(index: number): SpendingCategoriesName {
    return this.expensesGroup.get('spendingCategory'+index)?.value as SpendingCategoriesName;
  }

  public getCostByIndex(index: number) {
    return this.expensesGroup.get('cost'+index)?.value;
  }

  public get csvFile() {
    return this.expensesGroup.get('csvFile')?.value;
  }

  private setSpendingCategory(spendingCategory: SpendingCategoriesName, index: number) {
    this.expensesGroup.get('spendingCategory'+index)?.setValue(spendingCategory);
  }
}
