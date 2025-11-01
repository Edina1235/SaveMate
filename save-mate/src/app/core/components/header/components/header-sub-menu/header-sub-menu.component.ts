import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppUrl } from 'src/app/core/enums/app-url.enum';

@Component({
  selector: 'app-header-sub-menu',
  templateUrl: './header-sub-menu.component.html',
  styleUrls: ['./header-sub-menu.component.scss']
})
export class HeaderSubMenuComponent {
  public AppUrl = AppUrl;

  constructor(public dialogRef: MatDialogRef<HeaderSubMenuComponent>) {}

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
    console.log("logout");
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogRef.close();
  }
}
