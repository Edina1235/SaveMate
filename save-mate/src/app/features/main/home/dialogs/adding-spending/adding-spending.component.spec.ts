import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddingSpendingComponent } from './adding-spending.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { RecurringExpenseService } from 'src/app/core/services/recurring-expense.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { HeaderService } from 'src/app/core/components/header/header.service';
import { of } from 'rxjs';
import { ExpensesRowComponent } from 'src/app/shared/components/expenses-row/expenses-row.component';

describe('AddingSpendingComponent', () => {
  let component: AddingSpendingComponent;
  let fixture: ComponentFixture<AddingSpendingComponent>;

  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddingSpendingComponent>>;
  let incomeSpy: jasmine.SpyObj<IncomeService>;
  let expenseSpy: jasmine.SpyObj<ExpenseService>;
  let recurringSpy: jasmine.SpyObj<RecurringExpenseService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let headerSpy: any;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    incomeSpy = jasmine.createSpyObj('IncomeService', ['setIncome']);
    expenseSpy = jasmine.createSpyObj('ExpenseService', ['setExpense']);
    recurringSpy = jasmine.createSpyObj('RecurringExpenseService', ['setRecurringExpense']);
    toastSpy = jasmine.createSpyObj('ToastService', ['successToastr']);

    headerSpy = {
      user: {
        id: 'u1',
        fixSpendingCategories: []
      }
    };

    await TestBed.configureTestingModule({
      declarations: [AddingSpendingComponent, ExpensesRowComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: IncomeService, useValue: incomeSpy },
        { provide: ExpenseService, useValue: expenseSpy },
        { provide: RecurringExpenseService, useValue: recurringSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: HeaderService, useValue: headerSpy },
        { provide: MAT_DIALOG_DATA, useValue: 'test' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddingSpendingComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    incomeSpy.setIncome.and.returnValue(of({}));
    expenseSpy.setExpense.and.returnValue(of({}));
    recurringSpy.setRecurringExpense.and.returnValue(of({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    component.onClickClose();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should set valid form flag', () => {
    component.setValidForm(true);
    expect(component.validForm).toBeTrue();
  });

  it('should set expenses input', () => {
    component.setExpenses([
      { amount: 100, category: 'Food' } as any
    ]);

    expect(component.expensesInput.length).toBe(1);
  });

  it('should set incomes', () => {
    component.setIncomes([
      { amount: 1000 } as any
    ]);

    expect(component.incomes.length).toBe(1);
  });

  it('should call services on save', () => {
    component.incomes = [
      { id: '1', amount: 100, date: new Date(), source: 'test', userId: 'u1' }
    ] as any;

    component.expenses = [
      { id: '1', amount: 200, date: new Date(), userId: 'u1' }
    ] as any;

    component.recurringExpenses = [
      { id: '1', amount: 300, date: new Date(), userId: 'u1' }
    ] as any;

    component.onClickSave();

    expect(incomeSpy.setIncome).toHaveBeenCalled();
    expect(expenseSpy.setExpense).toHaveBeenCalled();
    expect(recurringSpy.setRecurringExpense).toHaveBeenCalled();
  });

  it('should handle empty expenses safely', () => {
    component.setExpenses([]);
    expect(component.expenses.length).toBe(0);
  });
});