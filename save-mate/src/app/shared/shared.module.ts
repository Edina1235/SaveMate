import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpendingCategoriesComponent } from './components/spending-categories/spending-categories.component';
import { DetailsComponent } from './components/spending-categories/components/details/details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    SpendingCategoriesComponent,
    DetailsComponent
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
    MatInputModule
  ]
})
export class SharedModule { }
