import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { HeaderService } from '../../header.service';
import { ChatComponent } from '../../../piggy-sense-chat/components/chat/chat.component';

@Component({
  selector: 'app-header-sub-menu',
  templateUrl: './header-sub-menu.component.html',
  styleUrls: ['./header-sub-menu.component.scss']
})
export class HeaderSubMenuComponent {
  public AppUrl = AppUrl;

  constructor(private dialogRef: MatDialogRef<HeaderSubMenuComponent>,
              private dialog: MatDialog,
              private router: Router,
              private afAuth: AngularFireAuth,
              private headerService: HeaderService
  ) {}

  public onClickPiggySense() {
    this.dialog.open(ChatComponent, {
      position: {
        bottom: '0.5rem',
        right: '4rem'
      }
    });
  }

  public onClickProfil() {
    this.closeDialog();
  }

  public onClickSettings() {
    this.closeDialog();
  }

  public onClickNotifications() {
    this.closeDialog();
  }

  public onClickContact() {
    this.closeDialog();
  }

  public onClickLogout() {
    this.afAuth.signOut();
    this.router.navigateByUrl(AppUrl.Login);
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogRef.close();
  }

  public get user() { 
    return this.headerService.user;
  }

  public get notifications() {
    return this.headerService.notifications;
  }

  public get hasUnreadNotifications() {
    return this.notifications.some(notification => !notification.isRead);
  }
}
