import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/notifications';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService]
    });

    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get notification by id', () => {
    service.getNotification('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get notifications by user id', () => {
    service.getNotificationsByUserId('123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user/123`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should get all notifications', () => {
    service.getNotifications().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update notification', () => {
    const mockNotification = { id: '1', title: 'test' } as any;

    service.updateNotification('1', mockNotification).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockNotification);

    req.flush({});
  });

  it('should delete notification', () => {
    service.deleteNotification('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create notification', () => {
    const mockNotification = { title: 'test' } as any;

    service.setNotification(mockNotification).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockNotification);

    req.flush({});
  });
});