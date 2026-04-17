import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  let afAuthMock: any;
  let routerMock: any;

  beforeEach(() => {
    afAuthMock = {
      authState: of(null)
    };

    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is logged in', (done) => {
    afAuthMock.authState = of({ uid: '123' });

    (guard.canActivate({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should block access and redirect when user is not logged in', (done) => {
    afAuthMock.authState = of(null);

    (guard.canActivate({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBeFalse();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login');
      done();
    });
  });
});