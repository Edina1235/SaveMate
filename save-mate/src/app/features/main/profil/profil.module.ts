import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilComponent } from './profil.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProfilComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProfilComponent },
    ])
  ]
})
export class ProfilModule { }
