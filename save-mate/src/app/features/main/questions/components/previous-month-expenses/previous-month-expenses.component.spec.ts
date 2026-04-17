import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviousMonthExpensesComponent } from './previous-month-expenses.component';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { ExpensesRowComponent } from 'src/app/shared/components/expenses-row/expenses-row.component';

describe('PreviousMonthExpensesComponent', () => {
  let component: PreviousMonthExpensesComponent;
  let fixture: ComponentFixture<PreviousMonthExpensesComponent>;

  let questionsServiceSpy: jasmine.SpyObj<QuestionsService>;

  beforeEach(async () => {
    questionsServiceSpy = jasmine.createSpyObj(
      'QuestionsService',
      ['setExpenses', 'setExpensesCsv', 'setIncomes'],
      {
        expenses: null,
        activeStep: null
      }
    );

    await TestBed.configureTestingModule({
      declarations: [PreviousMonthExpensesComponent, ExpensesRowComponent],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviousMonthExpensesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map expenses from service on init', async () => {
    const questionsServiceSpy = {expenses: [
      { category: SpendingCategoriesName.FoodAndHousehold, amount: 100 } as any,
      { category: SpendingCategoriesName.Transportation, amount: 200 } as any
    ]};

    await component.ngOnInit();

    expect(questionsServiceSpy.expenses.length).toBe(2);
    expect(questionsServiceSpy.expenses[0].amount).toBe(100);
  });

  it('should update expenses and call service', () => {
    const mockExpenses: any[] = [
      { category: SpendingCategoriesName.FoodAndHousehold, amount: 300 }
    ];

    component.setExpenses(mockExpenses);

    expect(component.expenses).toEqual(mockExpenses);
    expect(questionsServiceSpy.setExpenses).toHaveBeenCalledWith(mockExpenses);
  });

  it('should call setExpensesCsv', () => {
    const csv: any[] = [{ category: SpendingCategoriesName.FoodAndHousehold, amount: 10 }];

    component.setExpensesCsv(csv);

    expect(questionsServiceSpy.setExpensesCsv).toHaveBeenCalledWith(csv);
  });

  it('should call setIncomes', () => {
    const incomes: any[] = [{ amount: 500 } as any];

    component.setIncomes(incomes);

    expect(questionsServiceSpy.setIncomes).toHaveBeenCalledWith(incomes);
  });

  it('should set valid form flag', () => {
    component.setValidForm(true);

    expect(component.validForm).toBeTrue();
  });

  it('should go to DebtQuestion on next', async () => {
    component.expenses = [{ category: SpendingCategoriesName.FoodAndHousehold, amount: 100 } as any];

    await component.onClickNext();
    const questionsService = {activeStep: QuestionSteps.DebtQuestion};

    expect(questionsServiceSpy.setExpenses).toHaveBeenCalled();
    expect(questionsService.activeStep).toBe(QuestionSteps.DebtQuestion);
  });

  it('should go to Expenses on previous', async () => {
    component.expenses = [{ category: SpendingCategoriesName.FoodAndHousehold, amount: 100 } as any];

    await component.onClickPrevious();

    const questionsService = {activeStep: QuestionSteps.Expenses};

    expect(questionsServiceSpy.setExpenses).toHaveBeenCalled();
    expect(questionsService.activeStep).toBe(QuestionSteps.Expenses);
  });
});