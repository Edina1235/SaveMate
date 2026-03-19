import { NgModule } from '@angular/core';
import { ContactComponent } from './contact.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ContactComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ContactComponent },
    ])
  ]
})
export class ContactModule { }
