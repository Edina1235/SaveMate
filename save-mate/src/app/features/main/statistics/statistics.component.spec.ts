import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { RecurringExpenseService } from 'src/app/core/services/recurring-expense.service';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { HeaderService } from 'src/app/core/components/header/header.service';
import { of } from 'rxjs';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;

  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;
  let recurringExpenseServiceSpy: jasmine.SpyObj<RecurringExpenseService>;
  let savedAmountServiceSpy: jasmine.SpyObj<SavedAmountService>;
  let incomeServiceSpy: jasmine.SpyObj<IncomeService>;
  let headerServiceSpy: jasmine.SpyObj<HeaderService>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['getExpensesByUserId']);
    recurringExpenseServiceSpy = jasmine.createSpyObj('RecurringExpenseService', ['getRecurringExpensesByUserId']);
    savedAmountServiceSpy = jasmine.createSpyObj('SavedAmountService', ['getSavedAmountsByUserId']);
    incomeServiceSpy = jasmine.createSpyObj('IncomeService', ['getIncomesByUserId']);
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [], {
      user$: of({ id: '1' })
    });

    expenseServiceSpy.getExpensesByUserId.and.returnValue(of([]));
    recurringExpenseServiceSpy.getRecurringExpensesByUserId.and.returnValue(of([]));
    savedAmountServiceSpy.getSavedAmountsByUserId.and.returnValue(of([]));
    incomeServiceSpy.getIncomesByUserId.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [StatisticsComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: RecurringExpenseService, useValue: recurringExpenseServiceSpy },
        { provide: SavedAmountService, useValue: savedAmountServiceSpy },
        { provide: IncomeService, useValue: incomeServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open info dialog', () => {
    component.onClickInfo();

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should initialize on resize without crashing', () => {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500
    });

    component.onResize();

    expect(component).toBeTruthy();
  });

  it('should handle empty data in setData safely', () => {
    component['recurringExpenses'] = [];
    component['expenses'] = [];

    expect(() => (component as any)['setData']()).not.toThrow();
  });

  it('should handle empty products generation safely', () => {
    component['recurringExpenses'] = [];
    component['expenses'] = [];
    component['savedAmounts'] = [];
    component['incomes'] = [];

    expect(() => (component as any)['getProduct']()).not.toThrow();
  });
});