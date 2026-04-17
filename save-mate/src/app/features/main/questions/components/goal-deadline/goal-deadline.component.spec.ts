import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoalDeadlineComponent } from './goal-deadline.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { Goal } from 'src/app/core/models/goal';

describe('GoalDeadlineComponent', () => {
  let component: GoalDeadlineComponent;
  let fixture: ComponentFixture<GoalDeadlineComponent>;

  let questionsServiceSpy: jasmine.SpyObj<QuestionsService>;
  let activeStep: any = null;

  beforeEach(async () => {
    questionsServiceSpy = jasmine.createSpyObj('QuestionsService', [
      'setGoalDeadline'
    ], {
      goals: [],
      goalDeadlineYear: 5,
      get activeStep() { return activeStep; },
      set activeStep(value) { activeStep = value; }
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [GoalDeadlineComponent],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GoalDeadlineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set years from service on init if goals exist', () => {
    questionsServiceSpy.goals = { id: '1', userId: '', target: ['valami'], targetAmount: 0, deadline: new Date() } as Goal;

    component.ngOnInit();

    expect(component.goalDeadline.get('years')?.value).toBe(5);
  });

  it('should call setGoalDeadline and move to RecurringExpenses on next', () => {
    component.goalDeadline.get('years')?.setValue(3);

    component.onClickNext();
    const questionsService = {activeStep: QuestionSteps.RecurringExpenses};

    expect(questionsServiceSpy.setGoalDeadline).toHaveBeenCalledWith(3);
    expect(questionsService.activeStep).toBe(QuestionSteps.RecurringExpenses);
  });

  it('should call setGoalDeadline and move to Goals on previous', () => {
    component.goalDeadline.get('years')?.setValue(2);

    component.onClickPrevious();
    const questionsService = {activeStep: QuestionSteps.Goals};

    expect(questionsServiceSpy.setGoalDeadline).toHaveBeenCalledWith(2);
    expect(questionsService.activeStep).toBe(QuestionSteps.Goals);
  });

  it('should return years from form control', () => {
    component.goalDeadline.get('years')?.setValue(10);

    expect(component.years).toBe(10);
  });
});