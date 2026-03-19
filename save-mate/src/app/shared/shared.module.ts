import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpendingCategoriesComponent } from './components/spending-categories/spending-categories.component';
import { DetailsComponent } from './components/spending-categories/components/details/details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ThousandSpacePipe } from './pipe/thousand-space.pipe';
import { MonogramComponent } from './components/monogram/monogram.component';
import { FirstLetterPipe } from './pipe/first-letter.pipe';
import { RouterModule } from '@angular/router';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DebtRowsComponent } from './components/debt-rows/debt-rows.component';
import { SpendingCategoryIconsComponent } from './components/spending-category-icons/spending-category-icons.component';
import { ExpensesRowComponent } from './components/expenses-row/expenses-row.component';


@NgModule({
  declarations: [
    SpendingCategoriesComponent,
    DetailsComponent,
    ThousandSpacePipe,
    MonogramComponent,
    FirstLetterPipe,
    DebtRowsComponent,
    SpendingCategoryIconsComponent,
    ExpensesRowComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    CommonModule,
    SpendingCategoriesComponent,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ThousandSpacePipe,
    FirstLetterPipe,
    MonogramComponent,
    RouterModule,
    MatSlideToggleModule,
    DebtRowsComponent,
    SpendingCategoryIconsComponent,
    ExpensesRowComponent
  ]
})
export class SharedModule { }
