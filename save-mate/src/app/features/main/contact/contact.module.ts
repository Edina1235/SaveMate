import { NgModule } from '@angular/core';
import { ContactComponent } from './contact.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ContactComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: ContactComponent },
    ])
  ]
})
export class ContactModule { }
