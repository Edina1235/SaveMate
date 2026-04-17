import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  const afAuthMock: any = {
    currentUser: Promise.resolve(null)
  };

  const nextMock: HttpHandler = {
    handle: jasmine.createSpy('handle').and.returnValue(of({}))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AngularFireAuth, useValue: afAuthMock }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should pass request through if no user', (done) => {
    afAuthMock.currentUser = Promise.resolve(null);

    const req = new HttpRequest('GET', '/test');

    interceptor.intercept(req, nextMock).subscribe(() => {
      expect(nextMock.handle).toHaveBeenCalledWith(req);
      done();
    });
  });

  it('should attach token if user exists', (done) => {
    const fakeUser = {
      getIdToken: () => Promise.resolve('fake-token')
    };

    afAuthMock.currentUser = Promise.resolve(fakeUser);

    const req = new HttpRequest('GET', '/test');

    interceptor.intercept(req, nextMock).subscribe(() => {
      const calledReq = (nextMock.handle as jasmine.Spy).calls.mostRecent().args[0];

      expect(calledReq.headers.get('Authorization'))
        .toBe('Bearer fake-token');

      done();
    });
  });
});