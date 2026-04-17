import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserModifyDialogComponent } from './user-modify-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of } from 'rxjs';
import { Role } from 'src/app/core/models/user';

describe('UserModifyDialogComponent', () => {
  let component: UserModifyDialogComponent;
  let fixture: ComponentFixture<UserModifyDialogComponent>;

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  const userServiceMock = {
    updateUser: jasmine.createSpy().and.returnValue(of({}))
  };

  const toastServiceMock = {
    successToastr: jasmine.createSpy()
  };

  const mockUser = {
    id: '1',
    role: Role.User
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserModifyDialogComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockUser },
        { provide: UserService, useValue: userServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserModifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    dialogRefMock.close.calls.reset();
    userServiceMock.updateUser.calls.reset();
    toastServiceMock.successToastr.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set role on init', () => {
    const user = {name: 'valami', role: Role.User}
    expect(user.role).toBe(Role.User);
  });

  it('should close dialog', () => {
    component.onClickClose();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should update user and show toast then close dialog', () => {
    component.formGroup.get('role')?.setValue(Role.Admin);

    component.onClickSave();

    expect(userServiceMock.updateUser).toHaveBeenCalled();
    expect(toastServiceMock.successToastr)
      .toHaveBeenCalledWith('Siker', 'Sikeres módosítás');
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});