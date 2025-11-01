import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    KnowledgeBaseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: KnowledgeBaseComponent },
    ])
  ]
})
export class KnowledgeBaseModule { }
