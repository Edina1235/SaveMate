import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsDialogComponent } from './user-details-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('UserDetailsDialogComponent', () => {
  let component: UserDetailsDialogComponent;
  let fixture: ComponentFixture<UserDetailsDialogComponent>;

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  const mockUser = {
    id: '1',
    email: 'test@test.com'
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDetailsDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockUser }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    dialogRefMock.close.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive injected user data', () => {
    expect(component.user).toEqual(mockUser);
  });

  it('should close dialog on clickClose', () => {
    component.onClickClose();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});