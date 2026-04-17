import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { HeaderService } from 'src/app/core/components/header/header.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { GoalService } from 'src/app/core/services/goal.service';
import { DebtService } from 'src/app/core/services/debt.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { NotificationSchedulerService } from 'src/app/core/services/notification-scheduler.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of, Subject } from 'rxjs';
import { AvatarImageName } from 'src/app/core/enums/avatar-image-name.enum';
import { NotificationCategory } from 'src/app/core/enums/notification-category.enum';
import { AlertCondition } from 'src/app/core/models/alert';
import { MonogramComponent } from 'src/app/shared/components/monogram/monogram.component';
import { SpendingCategoryIconsComponent } from 'src/app/shared/components/spending-category-icons/spending-category-icons.component';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DebtRowsComponent } from 'src/app/shared/components/debt-rows/debt-rows.component';
import { FirstLetterPipe } from 'src/app/shared/pipe/first-letter.pipe';
import { ReactiveFormsModule } from '@angular/forms';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let headerServiceSpy: jasmine.SpyObj<HeaderService>;
  let incomeServiceSpy: jasmine.SpyObj<IncomeService>;
  let goalServiceSpy: jasmine.SpyObj<GoalService>;
  let debtServiceSpy: jasmine.SpyObj<DebtService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let savedAmountServiceSpy: jasmine.SpyObj<SavedAmountService>;
  let notificationSchedulerSpy: jasmine.SpyObj<NotificationSchedulerService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  const userSubject = new Subject<any>();

  beforeEach(async () => {
    headerServiceSpy = jasmine.createSpyObj('HeaderService', ['loadUserData'], {
      user$: userSubject.asObservable(),
      user: {
        id: 'u1',
        fixSpendingCategories: [],
        isGlobalNotificationsEnabled: true,
        avgMonthlyFixedCosts: 0
      }
    });

    incomeServiceSpy = jasmine.createSpyObj('IncomeService', ['getIncomesByUserId', 'updateIncome']);
    goalServiceSpy = jasmine.createSpyObj('GoalService', ['getGoalsByUserId', 'updateGoal']);
    debtServiceSpy = jasmine.createSpyObj('DebtService', ['getDebtsByUserId', 'updateDebt', 'setDebt', 'deleteDebt']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['getAlertByUserId', 'updateAlert', 'setAlert', 'deleteAlert']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['updateUser']);
    savedAmountServiceSpy = jasmine.createSpyObj('SavedAmountService', ['getSavedAmountsByUserId']);
    notificationSchedulerSpy = jasmine.createSpyObj('NotificationSchedulerService', ['initNotification']);
    toastSpy = jasmine.createSpyObj('ToastService', ['successToastr']);

    incomeServiceSpy.getIncomesByUserId.and.returnValue(of([]));
    savedAmountServiceSpy.getSavedAmountsByUserId.and.returnValue(of([]));
    goalServiceSpy.getGoalsByUserId.and.returnValue(of([]));
    debtServiceSpy.getDebtsByUserId.and.returnValue(of([]));
    alertServiceSpy.getAlertByUserId.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent, MonogramComponent, SpendingCategoryIconsComponent, MatSlideToggle, DebtRowsComponent, FirstLetterPipe],
      imports: [ReactiveFormsModule, MatSlideToggleModule],
      providers: [
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: IncomeService, useValue: incomeServiceSpy },
        { provide: GoalService, useValue: goalServiceSpy },
        { provide: DebtService, useValue: debtServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: SavedAmountService, useValue: savedAmountServiceSpy },
        { provide: NotificationSchedulerService, useValue: notificationSchedulerSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user form on user load', () => {
    userSubject.next({
      id: 'u1',
      lastname: 'Doe',
      firstname: 'John',
      nickname: 'johnny',
      email: 'john@test.com',
      fixSpendingCategories: [],
      isGlobalNotificationsEnabled: true
    });

    fixture.detectChanges();

    userSubject.subscribe(user => {
      expect(user.lastname).toBe('Doe');
      expect(user.firstname).toBe('John');
    });
  });

  it('should set avatar when clicked', () => {
    component.onClickAvatar(AvatarImageName.Avatar1);

    expect(component.selectedAvatar).toBe(AvatarImageName.Avatar1);
  });

  it('should reset avatar on monogram click', () => {
    component.selectedAvatar = AvatarImageName.Avatar1;

    component.onClickMonogram();

    expect(component.selectedAvatar).toBeNull();
  });

  it('should add new alert row', () => {
    component.categories = Object.values(NotificationCategory) as any;
    component.types = Object.values(AlertCondition) as any;

    component.alertIndexes = [0];

    component.onClickNewRow();

    expect(component.alertIndexes.length).toBe(2);
  });

  it('should remove alert row', () => {
    component.alertIndexes = [0, 1, 2];

    component.onClickDelete(1);

    expect(component.alertIndexes).not.toContain(1);
  });

  it('should call save methods', () => {
    spyOn<any>(component, 'updateUser');
    spyOn<any>(component, 'updatePayment');
    spyOn<any>(component, 'updateGoals');
    spyOn<any>(component, 'updateAlerts');
    spyOn<any>(component, 'updateDebts');

    component.onClickSave();

    expect(component['updateUser']).toHaveBeenCalled();
    expect(component['updatePayment']).toHaveBeenCalled();
    expect(component['updateGoals']).toHaveBeenCalled();
    expect(component['updateAlerts']).toHaveBeenCalled();
    expect(component['updateDebts']).toHaveBeenCalled();
  });
});