import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtsComponent } from './debts.component';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { DebtInput } from 'src/app/core/models/debt-input';
import { DebtRowsComponent } from 'src/app/shared/components/debt-rows/debt-rows.component';

describe('DebtsComponent', () => {
  let component: DebtsComponent;
  let fixture: ComponentFixture<DebtsComponent>;

  let questionsServiceSpy: jasmine.SpyObj<QuestionsService>;

  beforeEach(async () => {
    questionsServiceSpy = jasmine.createSpyObj('QuestionsService', ['setDebts'], {
      debts: [
        {
          name: 'Loan 1',
          totalAmount: 1000,
          monthlyPayment: 100,
          interest: 5,
          paidAmount: 200
        }
      ]
    });

    await TestBed.configureTestingModule({
      declarations: [DebtsComponent, DebtRowsComponent],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DebtsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize debtInputs from service on init', () => {
    component.ngOnInit();

    expect(component.debtInputs.length).toBe(1);
    expect(component.debtInputs[0].name).toBe('Loan 1');
    expect(component.debtInputs[0].totalAmount).toBe(1000);
  });

  it('should update validity state on invalidChange', () => {
    component.invalidChange(true);

    expect(component.isValidGroup).toBeTrue();
  });

  it('should update debtInputs on dataChange', () => {
    const newData: DebtInput[] = [
      {
        name: 'New debt',
        totalAmount: 500,
        monthlyPayment: 50,
        interest: 3,
        paidAmount: 0
      }
    ];

    component.dataChange(newData);

    expect(component.debtInputs).toEqual(newData);
  });

  it('should save debts and go to DebtDelay on next', () => {
    component.debtInputs = [
      {
        name: 'Debt A',
        totalAmount: 100,
        monthlyPayment: 10,
        interest: 1,
        paidAmount: 0
      }
    ];

    component.onClickNext();

    expect(questionsServiceSpy.setDebts).toHaveBeenCalledWith(component.debtInputs);
    expect(questionsServiceSpy.activeStep).toBe(QuestionSteps.DebtDelay);
  });

  it('should save debts and go to DebtQuestion on previous', () => {
    component.debtInputs = [
      {
        name: 'Debt B',
        totalAmount: 200,
        monthlyPayment: 20,
        interest: 2,
        paidAmount: 10
      }
    ];

    component.onClickPrevious();

    expect(questionsServiceSpy.setDebts).toHaveBeenCalledWith(component.debtInputs);
    expect(questionsServiceSpy.activeStep).toBe(QuestionSteps.DebtQuestion);
  });
});