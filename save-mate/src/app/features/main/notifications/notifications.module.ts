import { NgModule } from '@angular/core';
import { NotificationsComponent } from './notifications.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: NotificationsComponent },
    ])
  ]
})
export class NotificationsModule { }
