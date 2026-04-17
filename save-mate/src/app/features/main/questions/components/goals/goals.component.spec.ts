import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoalsComponent } from './goals.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { Goals } from 'src/app/core/enums/goals.enum';

describe('GoalsComponent', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;

  let questionsServiceMock: any;

  beforeEach(async () => {
    questionsServiceMock = {
      setGoalTarget: jasmine.createSpy('setGoalTarget'),
      goals: null,
      activeStep: null
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [GoalsComponent],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls for goals', () => {
    expect(Object.keys(component.goalsForm.controls).some(k => k.startsWith('goal'))).toBeTrue();
  });

  it('should set form values from service on init', () => {
    questionsServiceMock.goals = {
      targetAmount: 1000,
      target: [Goals.Travel]
    } as any;

    component.ngOnInit();

    expect(component.goalsForm.get('amount')?.value).toBe(1000);
  });

  it('should enable other checkbox when otherName changes', () => {
    const otherNameCtrl = component.goalsForm.get('otherName');

    otherNameCtrl?.setValue('My custom goal');

    expect(component.goalsForm.get('other')?.value).toBeTrue();
  });

  it('should return true when amount and at least one goal is selected', () => {
    component.goalsForm.get('amount')?.setValue(500);
    component.goalsForm.get('goal0')?.setValue(true);

    expect(component.isButtonActive()).toBeTrue();
  });

  it('should set goal target and move to GoalDeadline on next', () => {
    component.goalsForm.get('amount')?.setValue(200);
    component.goalsForm.get('goal0')?.setValue(true);

    component.onClickNext();

    expect(questionsServiceMock.setGoalTarget).toHaveBeenCalled();
    expect(questionsServiceMock.activeStep).toBe(QuestionSteps.GoalDeadline);
  });

  it('should set goal target and move to SavedAmount on previous', () => {
    component.goalsForm.get('amount')?.setValue(200);
    component.goalsForm.get('goal0')?.setValue(true);

    component.onClickPrevious();

    expect(questionsServiceMock.setGoalTarget).toHaveBeenCalled();
    expect(questionsServiceMock.activeStep).toBe(QuestionSteps.SavedAmount);
  });
});