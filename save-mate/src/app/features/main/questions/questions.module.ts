import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuestionsComponent } from './questions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IncomeComponent } from './components/income/income.component';
import { SavedAmountComponent } from './components/saved-amount/saved-amount.component';
import { GoalsComponent } from './components/goals/goals.component';
import { GoalDeadlineComponent } from './components/goal-deadline/goal-deadline.component';
import { RecurringExpensesComponent } from './components/recurring-expenses/recurring-expenses.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { PreviousMonthExpensesComponent } from './components/previous-month-expenses/previous-month-expenses.component';
import { DebtQuestionComponent } from './components/debt-question/debt-question.component';
import { DebtsComponent } from './components/debts/debts.component';
import { DebtDelayComponent } from './components/debt-delay/debt-delay.component';
import { PrepaymentComponent } from './components/prepayment/prepayment.component';
import { ɵInternalFormsSharedModule } from "@angular/forms";


@NgModule({
  declarations: [
    QuestionsComponent,
    IncomeComponent,
    SavedAmountComponent,
    GoalsComponent,
    GoalDeadlineComponent,
    RecurringExpensesComponent,
    ExpensesComponent,
    PreviousMonthExpensesComponent,
    DebtQuestionComponent,
    DebtsComponent,
    DebtDelayComponent,
    PrepaymentComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
        { path: '', component: QuestionsComponent },
    ]),
    ɵInternalFormsSharedModule
]
})
export class QuestionsModule { }
