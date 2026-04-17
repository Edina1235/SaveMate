import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MatDialog } from '@angular/material/dialog';

import { ThousandSpacePipe } from 'src/app/shared/pipe/thousand-space.pipe';
import { DebtService } from 'src/app/core/services/debt.service';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { RecurringExpenseService } from 'src/app/core/services/recurring-expense.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let debtServiceSpy: jasmine.SpyObj<DebtService>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;
  let recurringExpenseServiceSpy: jasmine.SpyObj<RecurringExpenseService>;
  let incomeServiceSpy: jasmine.SpyObj<IncomeService>;
  let savedAmountServiceSpy: jasmine.SpyObj<SavedAmountService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    debtServiceSpy = jasmine.createSpyObj('DebtService', ['getDebtsByUserId']);
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['getExpensesByUserId']);
    recurringExpenseServiceSpy = jasmine.createSpyObj('RecurringExpenseService', ['getRecurringExpensesByUserId']);
    incomeServiceSpy = jasmine.createSpyObj('IncomeService', ['getIncomesByUserId']);
    savedAmountServiceSpy = jasmine.createSpyObj('SavedAmountService', ['getSavedAmountsByUserId']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent, ThousandSpacePipe],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {
            authState: of(null),
            currentUser: Promise.resolve(null),
            signInWithEmailAndPassword: jasmine.createSpy()
          }
        },
        { provide: DebtService, useValue: debtServiceSpy },
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: RecurringExpenseService, useValue: recurringExpenseServiceSpy },
        { provide: IncomeService, useValue: incomeServiceSpy },
        { provide: SavedAmountService, useValue: savedAmountServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    (component as any).chartInstance = {
      setOption: jasmine.createSpy('setOption'),
      resize: jasmine.createSpy('resize')
    };

    (component as any).chartInstanceDebt = {
      setOption: jasmine.createSpy('setOption'),
      resize: jasmine.createSpy('resize')
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open debt dialog', () => {
    dialogSpy.open.and.returnValue({} as any);
    component.onClickOpenDebtDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should open saving dialog', () => {
    dialogSpy.open.and.returnValue({} as any);
    component.onClickOpenAddingSavingDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should open income dialog', () => {
    dialogSpy.open.and.returnValue({} as any);
    component.onClickOpenAddingIncomeDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should calculate percent correctly', () => {
    const result = (component as any).getPercent(200, 50);
    expect(result).toBe(25);
  });

  it('should return category icon', () => {
    const icon = (component as any).getSpendingIconByName(SpendingCategoriesName.FoodAndHousehold);
    expect(icon).toBeDefined();
  });

  it('should not crash initializeCharts when charts exist', () => {
    (component as any).chartInstance = { setOption: jasmine.createSpy(), resize: jasmine.createSpy() };
    (component as any).chartInstanceDebt = { setOption: jasmine.createSpy(), resize: jasmine.createSpy() };
    
    (component as any).initializeCharts();
    expect(true).toBeTrue();
  });

  it('should call getData on init', () => {
    spyOn<any>(component, 'getData').and.stub();
    component.ngOnInit();
    expect((component as any).getData).toHaveBeenCalled();
  });
});