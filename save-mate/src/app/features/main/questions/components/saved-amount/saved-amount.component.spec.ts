import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedAmountComponent } from './saved-amount.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

describe('SavedAmountComponent', () => {
  let component: SavedAmountComponent;
  let fixture: ComponentFixture<SavedAmountComponent>;

  let questionsServiceSpy: jasmine.SpyObj<QuestionsService>;

  beforeEach(async () => {
    questionsServiceSpy = jasmine.createSpyObj(
      'QuestionsService',
      ['setGoalSavedAmount'],
      {
        goals: true,
        savedAmount: 1500,
        activeStep: null
      }
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SavedAmountComponent],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SavedAmountComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set saved amount from service on init', () => {
    component.ngOnInit();

    expect(component.savedAmountGroup.get('savedAmount')?.value).toBe('1500');
  });

  it('should return savedAmount from getter', () => {
    component.savedAmountGroup.get('savedAmount')?.setValue('2000');

    expect(component.savedAmount).toBe('2000');
  });

  it('should call service and go to Goals on next', () => {
    component.savedAmountGroup.get('savedAmount')?.setValue('1000');

    component.onClickNext();
    const questionsService = {activeStep: QuestionSteps.Goals};
    expect(questionsServiceSpy.setGoalSavedAmount).toHaveBeenCalledWith(1000);
    expect(questionsService.activeStep).toBe(QuestionSteps.Goals);
  });

  it('should call service and go to Income on previous', () => {
    component.savedAmountGroup.get('savedAmount')?.setValue('1000');

    component.onClickPrevious();
    const questionsService = {activeStep: QuestionSteps.Income};
    expect(questionsServiceSpy.setGoalSavedAmount).toHaveBeenCalledWith(1000);
    expect(questionsService.activeStep).toBe(QuestionSteps.Income);
  });
});