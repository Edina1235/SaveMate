import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { NotificationSchedulerService } from 'src/app/core/services/notification-scheduler.service';
import { AppUrl } from 'src/app/core/enums/app-url.enum';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let routerMock: any;
  let afAuthMock: any;
  let alertServiceMock: any;
  let userServiceMock: any;
  let notificationMock: any;

  beforeEach(async () => {
    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    afAuthMock = {
      signInWithEmailAndPassword: jasmine.createSpy().and.returnValue(
        Promise.resolve({ user: { uid: '123' } })
      )
    };

    alertServiceMock = {
      getAlertByUserId: jasmine.createSpy().and.returnValue(of([]))
    };

    userServiceMock = {
      getUser: jasmine.createSpy().and.returnValue(of({
        id: '123',
        lastLoginDate: new Date()
      })),
      updateUser: jasmine.createSpy().and.returnValue(of({}))
    };

    notificationMock = {
      initNotification: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: NotificationSchedulerService, useValue: notificationMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate empty form', () => {
    component.loginForm.setValue({
      emailOrUsername: '',
      password: ''
    });

    expect(component.loginForm.valid).toBeFalse();
  });

  it('should call login on submit', fakeAsync(() => {
    component.loginForm.setValue({
      emailOrUsername: 'test@test.com',
      password: '123456'
    });

    component.onClickLogin();
    tick();

    expect(afAuthMock.signInWithEmailAndPassword).toHaveBeenCalledWith(
      'test@test.com',
      '123456'
    );
  }));

  it('should navigate to home after login', fakeAsync(() => {
    component.loginForm.setValue({
      emailOrUsername: 'test@test.com',
      password: '123456'
    });

    component.onClickLogin();
    tick();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(AppUrl.Home);
  }));

  it('should fetch alerts and user data', fakeAsync(() => {
    component.loginForm.setValue({
      emailOrUsername: 'test@test.com',
      password: '123456'
    });

    component.onClickLogin();
    tick();

    expect(alertServiceMock.getAlertByUserId).toHaveBeenCalledWith('123');
    expect(userServiceMock.getUser).toHaveBeenCalledWith('123');
  }));

  it('should initialize notifications for enabled alerts', fakeAsync(() => {
    alertServiceMock.getAlertByUserId.and.returnValue(of([
      { isEnabled: true }
    ]));

    component.loginForm.setValue({
      emailOrUsername: 'test@test.com',
      password: '123456'
    });

    component.onClickLogin();
    tick();

    expect(notificationMock.initNotification).toHaveBeenCalled();
  }));
});