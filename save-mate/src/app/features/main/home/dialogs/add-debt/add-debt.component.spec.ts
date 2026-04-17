import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDebtComponent } from './add-debt.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DebtService } from 'src/app/core/services/debt.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DebtRowsComponent } from 'src/app/shared/components/debt-rows/debt-rows.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';

describe('AddDebtComponent', () => {
  let component: AddDebtComponent;
  let fixture: ComponentFixture<AddDebtComponent>;

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  const debtServiceMock = {
    setDebt: jasmine.createSpy().and.returnValue(of({}))
  };

  const toastServiceMock = {
    successToastr: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDebtComponent, DebtRowsComponent],
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
        { provide: DebtService, useValue: debtServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddDebtComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  beforeEach(() => {
    debtServiceMock.setDebt.calls.reset();
    toastServiceMock.successToastr.calls.reset();
    dialogRefMock.close.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update validity state', () => {
    component.invalidChange(true);
    expect(component.isValidGroup).toBeTrue();
  });

  it('should update debt inputs', () => {
    const mockInputs = [
      { name: 'loan', totalAmount: 100, paidAmount: 0, monthlyPayment: 10, interest: 5 }
    ] as any;

    component.dataChange(mockInputs);

    expect(component.debtInputs).toEqual(mockInputs);
  });

  it('should close dialog', () => {
    component.onClickClose();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should save debts and trigger toast + close', async () => {

    component.debtInputs = [
      { name: 'a', totalAmount: 100, paidAmount: 0, monthlyPayment: 10, interest: 5 }
    ] as any;

    await component.onClickSave();

    expect(debtServiceMock.setDebt).toHaveBeenCalled();
    expect(toastServiceMock.successToastr).toHaveBeenCalledWith(
      'Siker',
      'Sikeres mentés'
    );
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});