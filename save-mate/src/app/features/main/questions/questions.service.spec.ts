import { TestBed } from '@angular/core/testing';
import { QuestionsService } from './questions.service';
import { UserService } from 'src/app/core/services/user.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { GoalService } from 'src/app/core/services/goal.service';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { DebtService } from 'src/app/core/services/debt.service';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { RecurringExpenseService } from 'src/app/core/services/recurring-expense.service';
import { of } from 'rxjs';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';

describe('QuestionsService', () => {
  let service: QuestionsService;

  let userServiceSpy: jasmine.SpyObj<UserService>;
  let incomeServiceSpy: jasmine.SpyObj<IncomeService>;
  let goalServiceSpy: jasmine.SpyObj<GoalService>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;
  let debtServiceSpy: jasmine.SpyObj<DebtService>;
  let savedAmountServiceSpy: jasmine.SpyObj<SavedAmountService>;
  let recurringExpenseServiceSpy: jasmine.SpyObj<RecurringExpenseService>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['updateUser']);
    incomeServiceSpy = jasmine.createSpyObj('IncomeService', ['setIncome', 'getIncomesByUserId']);
    goalServiceSpy = jasmine.createSpyObj('GoalService', ['setGoal']);
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['setExpense']);
    debtServiceSpy = jasmine.createSpyObj('DebtService', ['setDebt']);
    savedAmountServiceSpy = jasmine.createSpyObj('SavedAmountService', ['setSavedAmount']);
    recurringExpenseServiceSpy = jasmine.createSpyObj('RecurringExpenseService', ['setRecurringExpense']);

    TestBed.configureTestingModule({
      providers: [
        QuestionsService,
        { provide: UserService, useValue: userServiceSpy },
        { provide: IncomeService, useValue: incomeServiceSpy },
        { provide: GoalService, useValue: goalServiceSpy },
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: DebtService, useValue: debtServiceSpy },
        { provide: SavedAmountService, useValue: savedAmountServiceSpy },
        { provide: RecurringExpenseService, useValue: recurringExpenseServiceSpy }
      ]
    });

    service = TestBed.inject(QuestionsService);

    service.user = {
      id: 'user-1',
      fixSpendingCategories: [],
      topSpendingCategories: [],
      avgMonthlyFixedCosts: 0
    } as any;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should set income correctly', () => {
    service.setIncome(1000);

    expect(service.income?.amount).toBe(1000);
    expect(service.income?.userId).toBe('user-1');
  });

  it('should set goal saved amount', () => {
    service.setGoalSavedAmount(500);

    expect(service.savedAmount?.amount).toBe(500);
  });

  it('should set top spending categories', () => {
    service.setTopSpendingCategories([SpendingCategoriesName.FoodAndHousehold]);

    expect(service.user.topSpendingCategories.length).toBe(1);
  });

  it('should update active step', () => {
    service.activeStep = QuestionSteps.Income;

    service.activeStep = QuestionSteps.Debts;

    expect(service.activeStep).toBe(QuestionSteps.Debts);
  });

  it('should split expenses into recurring and normal expenses', () => {
    service.user.fixSpendingCategories = [SpendingCategoriesName.FoodAndHousehold];

    service.setExpenses([
      { category: SpendingCategoriesName.FoodAndHousehold, amount: 1000 },
      { category: SpendingCategoriesName.Transportation, amount: 2000 }
    ] as any);

    expect(service.recurringExpenses.length).toBe(1);
    expect(service.expenses.length).toBe(1);
  });

  it('should set debts correctly', () => {
    service.setDebts([
      {
        name: 'loan',
        totalAmount: 1200,
        monthlyPayment: 100,
        interest: 5,
        paidAmount: 0
      }
    ] as any);

    expect(service.debts.length).toBe(1);
    expect(service.debts[0].name).toBe('loan');
    expect(service.debts[0].userId).toBe('user-1');
  });

  it('should compute deadline date in setGoalDeadline', () => {
    service.goals = { target: [], targetAmount: 0, deadline: new Date() } as any;

    service.setGoalDeadline(2);

    expect(service.goalDeadlineYear).toBe(2);
    expect(service.goals?.deadline).toBeDefined();
  });

  it('should call finish without throwing', () => {
    userServiceSpy.updateUser.and.returnValue(of({}));
    expenseServiceSpy.setExpense.and.returnValue(of({}));
    recurringExpenseServiceSpy.setRecurringExpense.and.returnValue(of({}));
    debtServiceSpy.setDebt.and.returnValue(of({}));
    goalServiceSpy.setGoal.and.returnValue(of({}));
    incomeServiceSpy.setIncome.and.returnValue(of({}));
    savedAmountServiceSpy.setSavedAmount.and.returnValue(of({}));

    expect(() => service.finish()).not.toThrow();
  });
});