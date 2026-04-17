import { TestBed } from '@angular/core/testing';
import { AdminGuard } from './admin.guard';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Role } from '../models/user';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  let afAuthMock: any;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    afAuthMock = {
      authState: of(null)
    };

    userServiceMock = {
      getUser: jasmine.createSpy('getUser')
    };

    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login if user is not logged in', (done) => {
    afAuthMock.authState = of(null);

    (guard.canActivate({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBeFalse();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login');
      done();
    });
  });

  it('should allow access if user is admin', (done) => {
    afAuthMock.authState = of({ uid: '123' });

    userServiceMock.getUser.and.returnValue(
      of({ role: Role.Admin } as any)
    );

    (guard.canActivate({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect to home if user is not admin', (done) => {
    afAuthMock.authState = of({ uid: '123' });

    userServiceMock.getUser.and.returnValue(
      of({ role: Role.User } as any)
    );

    (guard.canActivate({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBeFalse();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
      done();
    });
  });

  it('should redirect to home if user is undefined', (done) => {
    afAuthMock.authState = of({ uid: '123' });

    userServiceMock.getUser.and.returnValue(
      of(undefined)
    );

    (guard.canActivate({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBeFalse();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
      done();
    });
  });
});