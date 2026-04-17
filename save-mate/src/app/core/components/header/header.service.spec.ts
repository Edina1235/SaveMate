import { TestBed } from '@angular/core/testing';
import { HeaderService } from './header.service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of, throwError } from 'rxjs';

describe('HeaderService', () => {
  let service: HeaderService;

  let userServiceMock: any;
  let notificationServiceMock: any;
  let afAuthMock: any;

  beforeEach(() => {
    userServiceMock = {
      getUser: jasmine.createSpy('getUser')
    };

    notificationServiceMock = {
      getNotificationsByUserId: jasmine.createSpy('getNotificationsByUserId').and.returnValue(of([]))
    };

    afAuthMock = {
      currentUser: Promise.resolve({ uid: '123' })
    };

    TestBed.configureTestingModule({
      providers: [
        HeaderService,
        { provide: UserService, useValue: userServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: AngularFireAuth, useValue: afAuthMock }
      ]
    });

    service = TestBed.inject(HeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load user and notifications successfully', async () => {
    const mockUser = { id: '123' } as any;

    userServiceMock.getUser.and.returnValue(of(mockUser));
    notificationServiceMock.getNotificationsByUserId.and.returnValue(of([{ id: 1 }]));

    spyOn(service, 'loadNotifications').and.callThrough();

    await service.loadUserData();

    expect(userServiceMock.getUser).toHaveBeenCalledWith('123');
    expect(service.user).toEqual(mockUser);
    expect(service.loadNotifications).toHaveBeenCalled();
  });

  it('should emit user via user$', async () => {
    const mockUser = { id: '123' };
    userServiceMock.getUser.and.returnValue(of(mockUser));

    let emittedUser: any;
    service.user$.subscribe(user => emittedUser = user);

    await service.loadUserData();

    expect(emittedUser).toEqual(mockUser);
  });

  it('should handle error in getUser', async () => {
    spyOn(console, 'error');

    userServiceMock.getUser.and.returnValue(
      throwError(() => new Error('error'))
    );

    await service.loadUserData();

    expect(console.error).toHaveBeenCalled();
  });

  it('should not call getUser if no current user', async () => {
    afAuthMock.currentUser = Promise.resolve(null);

    await service.loadUserData();

    expect(userServiceMock.getUser).not.toHaveBeenCalled();
  });

  it('should load notifications when user exists', () => {
    const mockUser = { id: '123' };
    const mockNotifications = [{ id: 1 }] as any;

    service.user = mockUser as any;

    notificationServiceMock.getNotificationsByUserId.and.returnValue(
      of(mockNotifications)
    );

    service.loadNotifications();

    expect(notificationServiceMock.getNotificationsByUserId)
      .toHaveBeenCalledWith('123');

    expect(service.notifications).toEqual(mockNotifications);
  });

  it('should not load notifications if user is undefined', () => {
    service.user = undefined;

    service.loadNotifications();

    expect(notificationServiceMock.getNotificationsByUserId)
      .not.toHaveBeenCalled();
  });

  it('should handle error in notifications loading', () => {
    spyOn(console, 'error');

    service.user = { id: '123' } as any;

    notificationServiceMock.getNotificationsByUserId.and.returnValue(
      throwError(() => new Error('error'))
    );

    service.loadNotifications();

    expect(console.error).toHaveBeenCalled();
  });
});