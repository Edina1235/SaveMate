import { NgModule } from '@angular/core';
import { NotificationsComponent } from './notifications.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: NotificationsComponent },
    ])
  ]
})
export class NotificationsModule { }
