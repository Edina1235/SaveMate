import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddingIncomeComponent } from './adding-income.component';
import { MatDialogRef } from '@angular/material/dialog';
import { IncomeService } from 'src/app/core/services/income.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

describe('AddingIncomeComponent', () => {
  let component: AddingIncomeComponent;
  let fixture: ComponentFixture<AddingIncomeComponent>;

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  const incomeServiceMock = {
    setIncome: jasmine.createSpy().and.returnValue(of({}))
  };

  const toastServiceMock = {
    successToastr: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddingIncomeComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {
            authState: of(null),
            currentUser: Promise.resolve({ uid: 'test-user' }),
            signInWithEmailAndPassword: jasmine.createSpy()
          }
        },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: IncomeService, useValue: incomeServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddingIncomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  beforeEach(() => {
    incomeServiceMock.setIncome.calls.reset();
    toastServiceMock.successToastr.calls.reset();
    dialogRefMock.close.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    component.onClickClose();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should save income and close dialog', async () => {
    component.incomeGroup.get('income')?.setValue('1000');

    await component.onClickSave();

    expect(incomeServiceMock.setIncome).toHaveBeenCalled();
    expect(toastServiceMock.successToastr).toHaveBeenCalledWith(
      'Siker',
      'Sikeres mentés'
    );
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should return income value from getter', () => {
    component.incomeGroup.get('income')?.setValue('500');

    expect(component.income).toBe('500');
  });
});