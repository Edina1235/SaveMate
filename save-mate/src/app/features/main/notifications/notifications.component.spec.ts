import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { HeaderService } from 'src/app/core/components/header/header.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of } from 'rxjs';
import { NotificationCategory } from 'src/app/core/enums/notification-category.enum';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let headerServiceSpy: jasmine.SpyObj<HeaderService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'getNotifications',
      'deleteNotification',
      'updateNotification'
    ]);

    headerServiceSpy = jasmine.createSpyObj('HeaderService', ['loadNotifications']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['successToastr']);

    await TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set screen to mobile when width <= 660', () => {
    (window as any).innerWidth = 500;

    component.onResize();

    expect(component.screen).toBe('mobile');
  });

  it('should set desktop and reset category on large screen', () => {
    (window as any).innerWidth = 800;

    component.activeCategory = 'Something' as any;

    component.onResize();

    expect(component.screen).toBe('desktop');
    expect(component.activeCategory).toBe(NotificationCategory.All);
  });

  it('should load notifications on init and reverse them', () => {
    const mockData: any[] = [
      { id: '1', isRead: false },
      { id: '2', isRead: true }
    ];

    notificationServiceSpy.getNotifications.and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.notifications.length).toBe(2);
    expect(component.notifications[0].id).toBe('2'); // reversed
  });

  it('should delete notification and update UI', () => {
    component.notifications = [
      { id: '1', isRead: false } as any,
      { id: '2', isRead: true } as any
    ];

    notificationServiceSpy.deleteNotification.and.returnValue(of({} as any));

    component.onClickDelete('1');

    expect(component.notifications.length).toBe(1);
    expect(headerServiceSpy.loadNotifications).toHaveBeenCalled();
    expect(toastServiceSpy.successToastr).toHaveBeenCalled();
  });

  it('should toggle read status and update service', () => {
    component.notifications = [
      { id: '1', isRead: false } as any
    ];

    notificationServiceSpy.updateNotification.and.returnValue(of({} as any));

    component.onClickReadStatus('1');

    expect(component.notifications[0].isRead).toBeTrue();
    expect(notificationServiceSpy.updateNotification).toHaveBeenCalled();
    expect(headerServiceSpy.loadNotifications).toHaveBeenCalled();
    expect(toastServiceSpy.successToastr).toHaveBeenCalled();
  });

  it('should set active category on click', () => {
    component.onClickCategory('Test' as any);

    expect(component.activeCategory).toBe('Test' as any);
  });

  it('should reset active category on back', () => {
    component.activeCategory = 'Something' as any;

    component.onClickBack();

    expect(component.activeCategory).toBeUndefined();
  });
});