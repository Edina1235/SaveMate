import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { UserService } from 'src/app/core/services/user.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  let routerMock: any;
  let afAuthMock: any;
  let userServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    afAuthMock = {
      createUserWithEmailAndPassword: jasmine.createSpy().and.returnValue(
        Promise.resolve({ user: { uid: '123' } })
      ),
      signInWithEmailAndPassword: jasmine.createSpy().and.returnValue(
        Promise.resolve({})
      )
    };

    userServiceMock = {
      setUser: jasmine.createSpy().and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate empty form', () => {
    expect(component.signUpForm.valid).toBeFalse();
  });

  it('should validate matching passwords', () => {
    component.signUpForm.setValue({
      lastName: 'Doe',
      firstName: 'John',
      userName: 'johndoe',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456'
    });

    expect(component.signUpForm.valid).toBeTrue();
  });

  it('should call Firebase createUser on signup', fakeAsync(() => {
    component.signUpForm.setValue({
      lastName: 'Doe',
      firstName: 'John',
      userName: 'johndoe',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onClickSignUp();
    tick();

    expect(afAuthMock.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      'test@test.com',
      '123456'
    );
  }));

  it('should create user in backend after signup', fakeAsync(() => {
    component.signUpForm.setValue({
      lastName: 'Doe',
      firstName: 'John',
      userName: 'johndoe',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onClickSignUp();
    tick();

    expect(userServiceMock.setUser).toHaveBeenCalled();
  }));

  it('should navigate to questions after signup', fakeAsync(() => {
    component.signUpForm.setValue({
      lastName: 'Doe',
      firstName: 'John',
      userName: 'johndoe',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onClickSignUp();
    tick();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(AppUrl.Questions);
  }));

  it('should navigate to login page', () => {
    component.onClickLogin();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(AppUrl.Login);
  });
});