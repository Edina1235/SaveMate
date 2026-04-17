import { TestBed } from '@angular/core/testing';
import { AlertService } from './alert.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AlertService', () => {
  let service: AlertService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/alerts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlertService]
    });

    service = TestBed.inject(AlertService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get alert by id', () => {
    service.getAlert('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get alerts by user id', () => {
    service.getAlertByUserId('123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user/123`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should get all alerts', () => {
    service.getAlerts().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update alert', () => {
    const mockAlert = { id: '1', message: 'test' } as any;

    service.updateAlert('1', mockAlert).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockAlert);

    req.flush({});
  });

  it('should delete alert', () => {
    service.deleteAlert('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create alert', () => {
    const mockAlert = { message: 'test' } as any;

    service.setAlert(mockAlert).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAlert);

    req.flush({});
  });
});