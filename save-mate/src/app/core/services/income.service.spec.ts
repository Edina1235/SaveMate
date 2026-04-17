import { TestBed } from '@angular/core/testing';
import { IncomeService } from './income.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('IncomeService', () => {
  let service: IncomeService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/income';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IncomeService]
    });

    service = TestBed.inject(IncomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get income by id', () => {
    service.getIncome('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get incomes by user id', () => {
    service.getIncomesByUserId('123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user/123`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should get all incomes', () => {
    service.getIncomes().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update income', () => {
    const mockIncome = { id: '1', amount: 1000 } as any;

    service.updateIncome('1', mockIncome).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockIncome);

    req.flush({});
  });

  it('should delete income', () => {
    service.deleteIncome('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create income', () => {
    const mockIncome = { amount: 5000 } as any;

    service.setIncome(mockIncome).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockIncome);

    req.flush({});
  });
});