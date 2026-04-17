import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';
import { AppUrl } from '../../enums/app-url.enum';
import { MatDialog } from '@angular/material/dialog';
import { HeaderSubMenuComponent } from './components/header-sub-menu/header-sub-menu.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../services/user.service';
import { Role, User } from '../../models/user';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public showHeader = true;
  public AppUrl = AppUrl;
  public isAdminShow: boolean = false;
  public title: string = '';

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private userService: UserService,
              private dialog: MatDialog,
              private headerService: HeaderService
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe({ next: (event: any) => {
        const hiddenRoutes = [AppUrl.Questions];
        this.showHeader = !hiddenRoutes.includes(event.urlAfterRedirects);
        this.setTitle(event.urlAfterRedirects);
      },
      error: (error) => {
        console.error(error);
      }});

    this.afAuth.authState.pipe(
      switchMap(user => this.userService.getUser(user!.uid)),
      map(user => (user as User).role === Role.Admin)
    ).subscribe({next: isAdmin => {
      this.isAdminShow = isAdmin;
    }, error: error => {
      console.error(error);
    }});
  }

  ngOnInit(): void {
      this.headerService.loadUserData();
  }

  private setTitle(url: string): void {
    switch (url) {
      case AppUrl.Home:
        this.title = 'Főoldal';
        break;
      case AppUrl.Admin:
        this.title = 'Admin';
        break;
      case AppUrl.Statistics:
        this.title = 'Statisztikák'; 
        break;
      case AppUrl.KnowledgeBase:
        this.title = 'Tudástár';
        break;
      case AppUrl.Settings:
        this.title = 'Beállítások';
        break;
      case AppUrl.Contact:
        this.title = 'Kapcsolat';
        break;
      case AppUrl.Notifications:
        this.title = 'Értesítések';
        break;
      case AppUrl.Profil:
        this.title = 'Profil';
        break;

      default:
        this.title = 'Főoldal';
        break;
    }
  }

  public onClickOpenSubMenu() {
    this.dialog.open(HeaderSubMenuComponent, {
      panelClass: 'custom-dialog-panel',
      autoFocus: false,
      disableClose: false,
      hasBackdrop: true
    });
  }

  public onClickIcon() {
    this.router.navigateByUrl(AppUrl.Home);
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
