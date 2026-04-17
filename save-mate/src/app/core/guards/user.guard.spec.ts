import { TestBed } from '@angular/core/testing';
import { UserGuard } from './user.guard';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('UserGuard', () => {
  let guard: UserGuard;

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
        UserGuard,
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(UserGuard);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login if not authenticated', (done) => {
    afAuthMock.authState = of(null);

    guard.canActivate().subscribe(result => {
      expect(result).toBeFalse();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login');
      done();
    });
  });

  it('should allow access if user has empty topSpendingCategories', (done) => {
    afAuthMock.authState = of({ uid: '123' });

    userServiceMock.getUser.and.returnValue(
      of({ topSpendingCategories: [] })
    );

    guard.canActivate().subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect if user has categories', (done) => {
    afAuthMock.authState = of({ uid: '123' });

    userServiceMock.getUser.and.returnValue(
      of({ topSpendingCategories: ['food'] })
    );

    guard.canActivate().subscribe(result => {
      expect(result).toBeFalse();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
      done();
    });
  });

  it('should redirect if getUser returns undefined', (done) => {
    afAuthMock.authState = of({ uid: '123' });

    userServiceMock.getUser.and.returnValue(of(undefined));

    guard.canActivate().subscribe(result => {
      expect(result).toBeFalse();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
      done();
    });
  });
});