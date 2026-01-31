import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';

@Component({
  selector: 'app-header-sub-menu',
  templateUrl: './header-sub-menu.component.html',
  styleUrls: ['./header-sub-menu.component.scss']
})
export class HeaderSubMenuComponent {
  public AppUrl = AppUrl;

  constructor(private dialogRef: MatDialogRef<HeaderSubMenuComponent>,
              private router: Router
  ) {}

  public onClickPiggySense() {}

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
    this.router.navigateByUrl(AppUrl.Login);
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogRef.close();
  }
}
