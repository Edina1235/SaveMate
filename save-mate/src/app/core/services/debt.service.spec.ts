import { TestBed } from '@angular/core/testing';
import { DebtService } from './debt.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DebtService', () => {
  let service: DebtService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/debts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DebtService]
    });

    service = TestBed.inject(DebtService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get debt by id', () => {
    service.getDebt('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get debts by user id', () => {
    service.getDebtsByUserId('123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user/123`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should get all debts', () => {
    service.getDebts().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update debt', () => {
    const mockDebt = { id: '1', amount: 1000 } as any;

    service.updateDebt('1', mockDebt).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockDebt);

    req.flush({});
  });

  it('should delete debt', () => {
    service.deleteDebt('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create debt', () => {
    const mockDebt = { amount: 500 } as any;

    service.setDebt(mockDebt).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDebt);

    req.flush({});
  });
});