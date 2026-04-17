import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: 'test-data' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    dialogRefMock.close.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close with false on clickClose', () => {
    component.onClickClose();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('should close with true on clickDelete', () => {
    component.onClickDelete();

    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should close with false on clickCancel', () => {
    component.onClickCancel();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });
});