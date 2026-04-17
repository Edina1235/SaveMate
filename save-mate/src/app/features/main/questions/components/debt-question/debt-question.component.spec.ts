import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtQuestionComponent } from './debt-question.component';
import { QuestionsService } from '../../questions.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

describe('DebtQuestionComponent', () => {
  let component: DebtQuestionComponent;
  let fixture: ComponentFixture<DebtQuestionComponent>;

  let questionsServiceMock: any;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    questionsServiceMock = {
      activeStep: QuestionSteps.DebtQuestion,
      finish: jasmine.createSpy('finish')
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [DebtQuestionComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DebtQuestionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set step to Debts on next', async () => {
    component.onClickNext();
    await fixture.whenStable();
    expect(questionsServiceMock.activeStep).toBe(QuestionSteps.Debts);
  });

  it('should set step to PreviousMonthExpenses on previous', () => {
    component.onClickPrevious();

    expect(questionsServiceMock.activeStep).toBe(
      QuestionSteps.PreviousMonthExpenses
    );
  });

  it('should finish and navigate to Home', () => {
    component.onClickFinish();

    expect(questionsServiceMock.finish).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(AppUrl.Home);
  });

  it('should return debt form value', () => {
    component.debtQuestionGroup.get('debt')?.setValue('yes');

    expect(component.debt).toBe('yes');
  });
});