import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddingSpendingComponent } from './dialogs/adding-spending/adding-spending.component';
import { AddDebtComponent } from './dialogs/add-debt/add-debt.component';
import { AddingSavingComponent } from './dialogs/adding-saving/adding-saving.component';
import { AddingIncomeComponent } from './dialogs/adding-income/adding-income.component';



@NgModule({
  declarations: [
    HomeComponent,
    AddingSavingComponent,
    AddingSpendingComponent,
    AddDebtComponent,
    AddingIncomeComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent },
    ])
  ]
})
export class HomeModule { }
