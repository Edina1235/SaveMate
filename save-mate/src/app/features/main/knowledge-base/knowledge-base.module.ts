import { NgModule } from '@angular/core';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    KnowledgeBaseComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
        { path: '', component: KnowledgeBaseComponent },
    ])
]
})
export class KnowledgeBaseModule { }
