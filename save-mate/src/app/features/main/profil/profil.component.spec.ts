import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfilComponent } from './profil.component';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DebtService } from 'src/app/core/services/debt.service';
import { UserService } from 'src/app/core/services/user.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { GoalService } from 'src/app/core/services/goal.service';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { of } from 'rxjs';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;

  let routerSpy: jasmine.SpyObj<Router>;
  let debtServiceSpy: jasmine.SpyObj<DebtService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let incomeServiceSpy: jasmine.SpyObj<IncomeService>;
  let goalServiceSpy: jasmine.SpyObj<GoalService>;
  let savedAmountServiceSpy: jasmine.SpyObj<SavedAmountService>;
  let afAuthSpy: any;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    debtServiceSpy = jasmine.createSpyObj('DebtService', ['getDebtsByUserId']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser', 'deleteUser']);
    incomeServiceSpy = jasmine.createSpyObj('IncomeService', ['getIncomesByUserId']);
    goalServiceSpy = jasmine.createSpyObj('GoalService', ['getGoalsByUserId']);
    savedAmountServiceSpy = jasmine.createSpyObj('SavedAmountService', ['getSavedAmountsByUserId']);

    afAuthSpy = {
      currentUser: Promise.resolve({ uid: '123', delete: jasmine.createSpy('delete') }),
      signOut: jasmine.createSpy('signOut')
    };

    await TestBed.configureTestingModule({
      declarations: [ProfilComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DebtService, useValue: debtServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: IncomeService, useValue: incomeServiceSpy },
        { provide: GoalService, useValue: goalServiceSpy },
        { provide: SavedAmountService, useValue: savedAmountServiceSpy },
        { provide: AngularFireAuth, useValue: afAuthSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data and related data on init', async () => {
    const mockUser = { id: '123' };

    savedAmountServiceSpy.getSavedAmountsByUserId.and.returnValue(of([
      { amount: 100 },
      { amount: 50 }
    ] as any));

    userServiceSpy.getUser.and.returnValue(of(mockUser as any));
    debtServiceSpy.getDebtsByUserId.and.returnValue(of([]));
    incomeServiceSpy.getIncomesByUserId.and.returnValue(of([]));
    goalServiceSpy.getGoalsByUserId.and.returnValue(of([]));

    await component.ngOnInit();

    expect(component.savedAmount).toBe(150);
    expect(component.user?.id).toBe('123');
  });

  it('should navigate to settings', () => {
    component.onClickModification();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(AppUrl.Settings);
  });

  it('should delete user and sign out', fakeAsync(() => {
    const userMock = { uid: '123', delete: jasmine.createSpy('delete') };

    (afAuthSpy.currentUser as any) = Promise.resolve(userMock);

    userServiceSpy.deleteUser.and.returnValue(of({} as any));

    component.onClickDelete();

    tick();

    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith('123');
    expect(userMock.delete).toHaveBeenCalled();
    expect(afAuthSpy.signOut).toHaveBeenCalled();
  }));

  it('should return correct icon for spending category', () => {
    const icon = component.getFixSpendingCategoriesIcon(
      SpendingCategoriesName.HousingAndUtilities
    );

    expect(icon).toBeDefined();
  });
});