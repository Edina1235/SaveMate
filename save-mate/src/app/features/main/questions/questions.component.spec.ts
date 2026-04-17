import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { QuestionsComponent } from './questions.component';
import { QuestionsService } from './questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

describe('QuestionsComponent', () => {
  let component: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;

  let questionsServiceMock: any;

  beforeEach(async () => {
    questionsServiceMock = {
      activeStep: QuestionSteps.Debts
    };

    await TestBed.configureTestingModule({
      declarations: [QuestionsComponent],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose QuestionSteps enum', () => {
    expect(component.QuestionSteps).toBeDefined();
    expect(component.QuestionSteps.Debts).toBeDefined();
  });

  it('should return activeStep from service', () => {
    expect(component.activeStep).toBe(QuestionSteps.Debts);
  });

  it('should reflect updated activeStep from service', () => {
    questionsServiceMock.activeStep = QuestionSteps.Goals;

    expect(component.activeStep).toBe(QuestionSteps.Goals);
  });
});