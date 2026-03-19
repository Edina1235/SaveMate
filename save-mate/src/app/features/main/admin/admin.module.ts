import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { UserModifyDialogComponent } from './dialogs/user-modify-dialog/user-modify-dialog.component';
import { UserDetailsDialogComponent } from './dialogs/user-details-dialog/user-details-dialog.component';
import { NewNotificationDialogComponent } from './dialogs/new-notification-dialog/new-notification-dialog.component';
import { KnowledgeBaseModifyDialogComponent } from './dialogs/knowledge-base-modify-dialog/knowledge-base-modify-dialog.component';
import { NewKnowledgeBaseDialogComponent } from './dialogs/new-knowledge-base-dialog/new-knowledge-base-dialog.component';


@NgModule({
  declarations: [
    AdminComponent,
    ConfirmDialogComponent,
    UserModifyDialogComponent,
    UserDetailsDialogComponent,
    NewNotificationDialogComponent,
    KnowledgeBaseModifyDialogComponent,
    NewKnowledgeBaseDialogComponent
  ],
  imports: [
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule.forChild([
      { path: '', component: AdminComponent },
    ])
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
