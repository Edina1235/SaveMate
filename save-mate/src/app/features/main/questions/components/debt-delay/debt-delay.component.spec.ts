import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtDelayComponent } from './debt-delay.component';
import { QuestionsService } from '../../questions.service';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { of } from 'rxjs';

describe('DebtDelayComponent', () => {
  let component: DebtDelayComponent;
  let fixture: ComponentFixture<DebtDelayComponent>;

  let questionsServiceSpy: jasmine.SpyObj<QuestionsService>;

  beforeEach(async () => {
    questionsServiceSpy = jasmine.createSpyObj('QuestionsService', [], {
      debts: [
        { hasArrears: false },
        { hasArrears: true }
      ],
      activeStep: QuestionSteps.Debts
    });

    await TestBed.configureTestingModule({
      declarations: [DebtDelayComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DebtDelayComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls for each debt', () => {
    expect(component.debtDelayGroup.contains('debt0')).toBeTrue();
    expect(component.debtDelayGroup.contains('debt1')).toBeTrue();
  });

  it('should set debt values from service on init', () => {
    component.ngOnInit();

    expect(component.debtDelayGroup.get('debt0')?.value).toBe(false);
    expect(component.debtDelayGroup.get('debt1')?.value).toBe(true);
  });

  it('should set enabledButton based on no debts and "no" selection', () => {
    component.debtDelayGroup.get('debtDelay')?.setValue('no');
    component.debtDelayGroup.get('debt0')?.setValue(false);
    component.debtDelayGroup.get('debt1')?.setValue(true);

    component.ngOnInit();

    expect(component.enabledButton).toBeFalse();
  });

  it('should set enabledButton false when inconsistent state', () => {
    component.debtDelayGroup.get('debtDelay')?.setValue('no');
    component.debtDelayGroup.get('debt0')?.setValue(false);

    component.ngOnInit();

    expect(component.enabledButton).toBeFalse();
  });

  it('should move to next step on clickNext', async () => {
    await component.onClickNext();
    const questionsService = {activeStep: QuestionSteps.Prepayment};
    expect(questionsService.activeStep).toBe(QuestionSteps.Prepayment);
  });

  it('should move to previous step on clickPrevious', async () => {
    await component.onClickPrevious();
    const questionsService = {activeStep: QuestionSteps.Debts};
    expect(questionsService.activeStep).toBe(QuestionSteps.Debts);
  });

  it('should update debts hasArrears on setCheckedDebts', async () => {
    component.debtDelayGroup.get('debt0')?.setValue(true);
    component.debtDelayGroup.get('debt1')?.setValue(false);

    await component['setCheckedDebts']();

    expect(questionsServiceSpy.debts[0].hasArrears).toBeFalse();
    expect(questionsServiceSpy.debts[1].hasArrears).toBeFalse();
  });
});