import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentComponent } from './prepayment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { AppUrl } from 'src/app/core/enums/app-url.enum';

describe('PrepaymentComponent', () => {
  let component: PrepaymentComponent;
  let fixture: ComponentFixture<PrepaymentComponent>;

  let routerSpy: jasmine.SpyObj<Router>;
  let questionsServiceSpy: jasmine.SpyObj<QuestionsService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    questionsServiceSpy = jasmine.createSpyObj(
      'QuestionsService',
      ['finish'],
      {
        debts: [
          { prepaymentAllowed: false },
          { prepaymentAllowed: false }
        ],
        activeStep: null
      }
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PrepaymentComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: QuestionsService, useValue: questionsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaymentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls for debts', () => {
    expect(component.debtsGroup.contains('debt0')).toBeTrue();
    expect(component.debtsGroup.contains('debt1')).toBeTrue();
  });

  it('should set form values from service on init', () => {
    questionsServiceSpy.debts[0].prepaymentAllowed = true;

    component.ngOnInit();

    expect(component.debtsGroup.get('debt0')?.value).toBeTrue();
  });

  it('should call finish and navigate on onClickFinish', () => {
    component.debtsGroup.get('debt0')?.setValue(true);

    component.onClickFinish();

    expect(questionsServiceSpy.finish).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(AppUrl.Home);
  });

  it('should set activeStep to DebtDelay on previous', () => {
    component.debtsGroup.get('debt0')?.setValue(true);

    component.onClickPrevious();
    const questionsService = {activeStep: QuestionSteps.DebtDelay};
    expect(questionsService.activeStep).toBe(QuestionSteps.DebtDelay);
  });
});