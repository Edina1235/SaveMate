import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { Role } from '../../models/user';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  let afAuthMock: any;
  let userServiceMock: any;

  beforeEach(async () => {
    afAuthMock = {
      authState: of({ uid: '123' })
    };

    userServiceMock = {
      getUser: jasmine.createSpy('getUser')
    };

    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAdminShow to true when user is admin', () => {
    userServiceMock.getUser.and.returnValue(
      of({ role: Role.Admin })
    );

    component.ngOnInit();

    expect(component.isAdminShow).toBeTrue();
    expect(userServiceMock.getUser).toHaveBeenCalledWith('123');
  });

  it('should set isAdminShow to false when user is not admin', () => {
    userServiceMock.getUser.and.returnValue(
      of({ role: Role.User })
    );

    component.ngOnInit();

    expect(component.isAdminShow).toBeFalse();
  });

  it('should handle error from userService', () => {
    spyOn(console, 'error');

    userServiceMock.getUser.and.returnValue(
      throwError(() => new Error('Test error'))
    );

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith(
      'Error fetching user data: ',
      jasmine.any(Error)
    );
  });

  it('should keep default values before init', () => {
    expect(component.showFooter).toBeTrue();
    expect(component.isAdminShow).toBeFalse();
  });
});
