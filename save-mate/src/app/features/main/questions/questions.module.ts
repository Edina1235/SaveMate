import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuestionsComponent } from './questions.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    QuestionsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: QuestionsComponent },
    ])
  ]
})
export class QuestionsModule { }
