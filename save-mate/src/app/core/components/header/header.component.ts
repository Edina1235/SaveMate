import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppUrl } from '../../enums/app-url.enum';
import { MatDialog } from '@angular/material/dialog';
import { HeaderSubMenuComponent } from './components/header-sub-menu/header-sub-menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public showHeader = true;
  public AppUrl = AppUrl;

  constructor(private router: Router,
              private dialog: MatDialog
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        const hiddenRoutes = [AppUrl.Questions];
        this.showHeader = !hiddenRoutes.includes(event.urlAfterRedirects);
      });
  }

  public onClickOpenSubMenu() {
    this.dialog.open(HeaderSubMenuComponent, {
      panelClass: 'custom-dialog-panel',
      autoFocus: false,
      disableClose: false,
      hasBackdrop: true
    });
  }
}
