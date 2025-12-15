import { NgModule } from '@angular/core';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    KnowledgeBaseComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: KnowledgeBaseComponent },
    ])
  ]
})
export class KnowledgeBaseModule { }
