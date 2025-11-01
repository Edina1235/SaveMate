import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpendingCategoriesComponent } from './components/spending-categories/spending-categories.component';
import { DetailsComponent } from './components/spending-categories/components/details/details.component';



@NgModule({
  declarations: [
    SpendingCategoriesComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SpendingCategoriesComponent
  ]
})
export class SharedModule { }
