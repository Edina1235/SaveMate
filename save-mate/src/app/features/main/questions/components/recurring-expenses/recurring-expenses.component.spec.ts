import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecurringExpensesComponent } from './recurring-expenses.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { SpendingCategoriesComponent } from 'src/app/shared/components/spending-categories/spending-categories.component';

describe('RecurringExpensesComponent', () => {
  let component: RecurringExpensesComponent;
  let fixture: ComponentFixture<RecurringExpensesComponent>;

  let questionsServiceSpy: jasmine.SpyObj<QuestionsService>;

  beforeEach(async () => {
    questionsServiceSpy = jasmine.createSpyObj(
      'QuestionsService',
      ['setRecurringExpenses'],
      {
        user: null,
        activeStep: null
      }
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RecurringExpensesComponent, SpendingCategoriesComponent],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecurringExpensesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set active categories and avg from user on init', () => {
    questionsServiceSpy.user = {
      fixSpendingCategories: [SpendingCategoriesName.FoodAndHousehold],
      avgMonthlyFixedCosts: 1000
    } as any;

    component.ngOnInit();

    const questionsService = {user: {
      fixSpendingCategories: [SpendingCategoriesName.FoodAndHousehold],
      avgMonthlyFixedCosts: 1000
    } as any};

    expect(questionsService.user.fixSpendingCategories.length).toBe(1);
    expect(questionsService.user.avgMonthlyFixedCosts).toBe(1000);
  });

  it('should return avg from getter', () => {
    component.recurringExpensesGroup.get('avg')?.setValue(500);

    expect(component.avg).toBe(500);
  });

  it('should update active categories', () => {
    const cats = [SpendingCategoriesName.Transportation];

    component.setActiveCategories(cats);

    expect(component.activeCategories).toEqual(cats);
  });

  it('should call service and go to Expenses on next', () => {
    component.activeCategories = [SpendingCategoriesName.FoodAndHousehold];
    component.recurringExpensesGroup.get('avg')?.setValue(200);

    component.onClickNext();

    expect(questionsServiceSpy.setRecurringExpenses).toHaveBeenCalledWith(
      component.activeCategories,
      200
    );
    const questionsService = {activeStep: QuestionSteps.Expenses};
    expect(questionsService.activeStep).toBe(QuestionSteps.Expenses);
  });

  it('should call service and go to GoalDeadline on previous', () => {
    component.activeCategories = [SpendingCategoriesName.FoodAndHousehold];
    component.recurringExpensesGroup.get('avg')?.setValue(200);

    component.onClickPrevious();

    const questionsService = {activeStep: QuestionSteps.GoalDeadline};
    expect(questionsServiceSpy.setRecurringExpenses).toHaveBeenCalled();
    expect(questionsService.activeStep).toBe(QuestionSteps.GoalDeadline);
  });
});