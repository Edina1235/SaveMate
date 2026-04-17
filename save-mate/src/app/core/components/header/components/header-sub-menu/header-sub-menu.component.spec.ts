import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderSubMenuComponent } from './header-sub-menu.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HeaderService } from '../../header.service';
import { AppUrl } from 'src/app/core/enums/app-url.enum';

describe('HeaderSubMenuComponent', () => {
  let component: HeaderSubMenuComponent;
  let fixture: ComponentFixture<HeaderSubMenuComponent>;

  let dialogRefMock: any;
  let dialogMock: any;
  let routerMock: any;
  let afAuthMock: any;
  let headerServiceMock: any;

  beforeEach(async () => {
    dialogRefMock = {
      close: jasmine.createSpy('close')
    };

    dialogMock = {
      open: jasmine.createSpy('open')
    };

    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    afAuthMock = {
      signOut: jasmine.createSpy('signOut')
    };

    headerServiceMock = {
      user: { name: 'Test User' },
      notifications: []
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderSubMenuComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: HeaderService, useValue: headerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderSubMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open chat dialog on onClickPiggySense', () => {
    component.onClickPiggySense();

    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should close dialog on profile click', () => {
    component.onClickProfil();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should close dialog on settings click', () => {
    component.onClickSettings();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should close dialog on notifications click', () => {
    component.onClickNotifications();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should close dialog on contact click', () => {
    component.onClickContact();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should logout user and navigate to login', () => {
    component.onClickLogout();

    expect(afAuthMock.signOut).toHaveBeenCalled();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(AppUrl.Login);
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should return user from headerService', () => {
    expect(component.user).toEqual(headerServiceMock.user);
  });

  it('should return notifications from headerService', () => {
    expect(component.notifications).toEqual(headerServiceMock.notifications);
  });

  it('should return true if there are unread notifications', () => {
    headerServiceMock.notifications = [
      { isRead: true },
      { isRead: false }
    ];

    expect(component.hasUnreadNotifications).toBeTrue();
  });

  it('should return false if all notifications are read', () => {
    headerServiceMock.notifications = [
      { isRead: true },
      { isRead: true }
    ];

    expect(component.hasUnreadNotifications).toBeFalse();
  });
});
