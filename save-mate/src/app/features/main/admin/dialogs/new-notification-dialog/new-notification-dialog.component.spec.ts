import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewNotificationDialogComponent } from './new-notification-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of } from 'rxjs';
import { NotificationCategory } from 'src/app/core/enums/notification-category.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NewNotificationDialogComponent', () => {
  let component: NewNotificationDialogComponent;
  let fixture: ComponentFixture<NewNotificationDialogComponent>;

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  const notificationServiceMock = {
    setNotification: jasmine.createSpy().and.returnValue(of({}))
  };

  const userServiceMock = {
    getUsers: jasmine.createSpy().and.returnValue(
      of([
        { id: '1', email: 'a@test.com' },
        { id: '2', email: 'b@test.com' }
      ])
    )
  };

  const toastServiceMock = {
    successToastr: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewNotificationDialogComponent],
      imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    dialogRefMock.close.calls.reset();
    notificationServiceMock.setNotification.calls.reset();
    toastServiceMock.successToastr.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change category on option click', () => {
    component.onClickOption(0);
    expect(component.selectedCategory).toBeTruthy();
  });

  it('should close dialog', () => {
    component.onClickClose();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should save notifications for ALL users', () => {
    component.formGroup.patchValue({
      user: 'all',
      title: 't',
      text: 'x',
      category: NotificationCategory.MonthlySummary
    });

    component.onClickSave();

    expect(userServiceMock.getUsers).toHaveBeenCalled();
    expect(notificationServiceMock.setNotification).toHaveBeenCalled();
  });

  it('should return user form value', () => {
    component.formGroup.get('user')?.setValue('all');

    expect(component.user).toBe('all');
  });
});