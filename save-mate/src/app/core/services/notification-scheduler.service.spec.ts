import { TestBed } from '@angular/core/testing';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { ExpenseService } from './expense.service';
import { RecurringExpenseService } from './recurring-expense.service';
import { NotificationService } from './notification.service';
import { ToastService } from './toast.service';
import { of } from 'rxjs';
import { AlertCondition } from '../models/alert';

describe('NotificationSchedulerService', () => {
  let service: NotificationSchedulerService;

  let expenseServiceMock: any;
  let recurringExpenseServiceMock: any;
  let notificationServiceMock: any;
  let toastServiceMock: any;

  beforeEach(() => {
    expenseServiceMock = {
      getExpensesByUserId: jasmine.createSpy().and.returnValue(of([]))
    };

    recurringExpenseServiceMock = {
      getRecurringExpensesByUserId: jasmine.createSpy().and.returnValue(of([]))
    };

    notificationServiceMock = {
      setNotification: jasmine.createSpy().and.returnValue(of({}))
    };

    toastServiceMock = {
      infoToastr: jasmine.createSpy()
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationSchedulerService,
        { provide: ExpenseService, useValue: expenseServiceMock },
        { provide: RecurringExpenseService, useValue: recurringExpenseServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    });

    service = TestBed.inject(NotificationSchedulerService);

    spyOn<any>(service, 'triggerNotification').and.callThrough();
    spyOn<any>(service, 'scheduleNotification').and.callThrough();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger immediate notification when targetDate <= now', () => {
    const alert: any = {
      condition: AlertCondition.SavingGoalProgress,
      conditionValue: 1,
      title: 't',
      text: 'x',
      userId: 'u',
      type: 'test'
    };

    service.initNotification(new Date(2000, 1, 1), alert, 'u');

    expect(service['triggerNotification']).toHaveBeenCalled();
  });

  it('should handle bill due date', () => {
    const alert: any = {
      condition: AlertCondition.BillDueDate,
      conditionValue: 10,
      title: 't',
      text: 'x',
      userId: 'u',
      type: 'test'
    };

    const result = (service as any).getDate(alert, 'u');

    expect(result instanceof Date).toBeTrue();
  });

  it('should handle debt due date', () => {
    const alert: any = {
      condition: AlertCondition.DebtDueDate,
      conditionValue: 10,
      title: 't',
      text: 'x',
      userId: 'u',
      type: 'test'
    };

    const result = (service as any).getDate(alert, 'u');

    expect(result instanceof Date).toBeTrue();
  });

  it('should schedule notification for future date', () => {
    const future = new Date(Date.now() + 100000);

    const alert: any = {
      condition: AlertCondition.SavingGoalProgress,
      conditionValue: 1,
      title: 't',
      text: 'x',
      userId: 'u',
      type: 'test'
    };

    spyOn<any>(service, 'getDate').and.returnValue(future);

    service.initNotification(new Date(2000, 1, 1), alert, 'u');

    expect(service['scheduleNotification']).toHaveBeenCalledWith(future, alert);
  });
});