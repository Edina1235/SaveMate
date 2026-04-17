import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeComponent } from './income.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { UserService } from 'src/app/core/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';

describe('IncomeComponent', () => {
  let component: IncomeComponent;
  let fixture: ComponentFixture<IncomeComponent>;

  let questionsServiceMock: any;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let afAuthSpy: jasmine.SpyObj<AngularFireAuth>;

  beforeEach(async () => {
    questionsServiceMock = {
      setIncome: jasmine.createSpy('setIncome'),
      user: null,
      income: null,
      activeStep: null
    };

    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);

    afAuthSpy = jasmine.createSpyObj('AngularFireAuth', [], {
      authState: of({ uid: '123' })
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [IncomeComponent],
      providers: [
        { provide: QuestionsService, useValue: questionsServiceMock },
        { provide: UserService, useValue: userServiceSpy },
        { provide: AngularFireAuth, useValue: afAuthSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IncomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set income from service on init', () => {
    questionsServiceMock.income = { amount: 5000 } as any;

    component.ngOnInit();

    expect(component.incomeGroup.get('income')?.value).toBe('5000');
  });

  it('should call setIncome and move to SavedAmount on next', () => {
    component.incomeGroup.get('income')?.setValue('1000');

    component.onClickNext();

    expect(questionsServiceMock.setIncome).toHaveBeenCalledWith(1000);
    expect(questionsServiceMock.activeStep).toBe(QuestionSteps.SavedAmount);
  });

  it('should return income value from getter', () => {
    component.incomeGroup.get('income')?.setValue('2500');

    expect(component.income).toBe('2500');
  });

  it('should fetch user if not present in service', () => {
    userServiceSpy.getUser.and.returnValue(of({ id: '123' } as any));

    component.ngOnInit();

    expect(userServiceSpy.getUser).toHaveBeenCalledWith('123');
  });
});