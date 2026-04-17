import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from './header.service';
import { of, Subject, throwError } from 'rxjs';
import { Role } from '../../models/user';
import { AppUrl } from '../../enums/app-url.enum';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let routerEvents$: Subject<any>;
  let routerMock: any;
  let afAuthMock: any;
  let userServiceMock: any;
  let dialogMock: any;
  let headerServiceMock: any;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    routerMock = {
      events: routerEvents$,
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    afAuthMock = {
      authState: of({ uid: '123' })
    };

    userServiceMock = {
      getUser: jasmine.createSpy('getUser').and.returnValue(
        of({ role: Role.Admin })
      )
    };

    dialogMock = {
      open: jasmine.createSpy('open')
    };

    headerServiceMock = {
      loadUserData: jasmine.createSpy('loadUserData'),
      user: { name: 'Test User' },
      notifications: []
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: HeaderService, useValue: headerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUserData on init', () => {
    component.ngOnInit();

    expect(headerServiceMock.loadUserData).toHaveBeenCalled();
  });

  it('should set isAdminShow to true for admin user', () => {
    expect(component.isAdminShow).toBeTrue();
  });

  it('should handle non-admin user', () => {
    userServiceMock.getUser.and.returnValue(of({ role: Role.User }));

    // új példány kell, mert constructorban fut
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    expect(component.isAdminShow).toBeFalse();
  });

  it('should handle error in auth subscription', () => {
    spyOn(console, 'error');

    userServiceMock.getUser.and.returnValue(
      throwError(() => new Error('error'))
    );

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    expect(console.error).toHaveBeenCalled();
  });

  it('should react to navigation and set title + showHeader', () => {
    routerEvents$.next(new NavigationEnd(1, AppUrl.Home, AppUrl.Home));

    expect(component.showHeader).toBeTrue();
    expect(component.title).toBe('Főoldal');
  });

  it('should hide header on hidden route', () => {
    routerEvents$.next(new NavigationEnd(1, AppUrl.Questions, AppUrl.Questions));

    expect(component.showHeader).toBeFalse();
  });

  it('should set different titles correctly', () => {
    const cases = [
      { url: AppUrl.Admin, title: 'Admin' },
      { url: AppUrl.Statistics, title: 'Statisztikák' },
      { url: AppUrl.Settings, title: 'Beállítások' }
    ];

    cases.forEach(c => {
      routerEvents$.next(new NavigationEnd(1, c.url, c.url));
      expect(component.title).toBe(c.title);
    });
  });

  it('should fallback to default title', () => {
    routerEvents$.next(new NavigationEnd(1, '/unknown', '/unknown'));

    expect(component.title).toBe('Főoldal');
  });

  it('should open submenu dialog', () => {
    component.onClickOpenSubMenu();

    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should navigate to home on icon click', () => {
    component.onClickIcon();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(AppUrl.Home);
  });

  it('should return user from headerService', () => {
    expect(component.user).toEqual(headerServiceMock.user);
  });

  it('should return notifications from headerService', () => {
    expect(component.notifications).toEqual(headerServiceMock.notifications);
  });

  it('should detect unread notifications', () => {
    headerServiceMock.notifications = [
      { isRead: true },
      { isRead: false }
    ];

    expect(component.hasUnreadNotifications).toBeTrue();
  });

  it('should detect no unread notifications', () => {
    headerServiceMock.notifications = [
      { isRead: true }
    ];

    expect(component.hasUnreadNotifications).toBeFalse();
  });
});
