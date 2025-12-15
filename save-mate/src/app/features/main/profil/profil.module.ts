import { NgModule } from '@angular/core';
import { ProfilComponent } from './profil.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProfilComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: ProfilComponent },
    ])
  ]
})
export class ProfilModule { }
