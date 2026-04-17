import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensesComponent } from './expenses.component';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { SpendingCategoriesComponent } from 'src/app/shared/components/spending-categories/spending-categories.component';

describe('ExpensesComponent', () => {
  let component: ExpensesComponent;
  let fixture: ComponentFixture<ExpensesComponent>;

  let questionsServiceMock: any;

  beforeEach(async () => {
    questionsServiceMock = {
      setTopSpendingCategories: jasmine.createSpy('setTopSpendingCategories'),
      user: {
        topSpendingCategories: [
          SpendingCategoriesName.FoodAndHousehold,
          SpendingCategoriesName.Transportation
        ]
      },
      activeStep: QuestionSteps.Expenses
    };

    await TestBed.configureTestingModule({
      declarations: [ExpensesComponent, SpendingCategoriesComponent],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize activeCategories from user on init', () => {
    component.ngOnInit();

    expect(component.activeCategories.length).toBe(2);
    expect(component.activeCategories).toContain(
      SpendingCategoriesName.FoodAndHousehold
    );
  });

  it('should set active categories via setActiveCategories', () => {
    const newCategories = [
      SpendingCategoriesName.ClothingAndOtherShopping
    ];

    component.setActiveCategories(newCategories);

    expect(component.activeCategories).toEqual(newCategories);
  });

  it('should save categories and go to PreviousMonthExpenses on next', () => {
    component.activeCategories = [
      SpendingCategoriesName.FoodAndHousehold
    ];

    component.onClickNext();

    expect(questionsServiceMock.setTopSpendingCategories)
      .toHaveBeenCalledWith(component.activeCategories);

    expect(questionsServiceMock.activeStep)
      .toBe(QuestionSteps.PreviousMonthExpenses);
  });

  it('should save categories and go to RecurringExpenses on previous', () => {
    component.activeCategories = [
      SpendingCategoriesName.Transportation
    ];

    component.onClickPrevious();

    expect(questionsServiceMock.setTopSpendingCategories)
      .toHaveBeenCalledWith(component.activeCategories);

    expect(questionsServiceMock.activeStep)
      .toBe(QuestionSteps.RecurringExpenses);
  });

  it('should not fail if user is undefined', () => {
    questionsServiceMock.user = undefined;

    expect(() => component.ngOnInit()).not.toThrow();
    expect(component.activeCategories).toEqual([]);
  });
});