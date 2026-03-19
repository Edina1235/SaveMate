import { NgModule } from '@angular/core';
import { ProfilComponent } from './profil.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from "src/app/shared/shared.module";



@NgModule({
  declarations: [
    ProfilComponent
  ],
  imports: [
    RouterModule.forChild([
        { path: '', component: ProfilComponent },
    ]),
    SharedModule
]
})
export class ProfilModule { }
