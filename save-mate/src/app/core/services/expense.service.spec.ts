import { TestBed } from '@angular/core/testing';
import { ExpenseService } from './expense.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/expenses';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExpenseService]
    });

    service = TestBed.inject(ExpenseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get expense by id', () => {
    service.getExpense('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get expenses by user id', () => {
    service.getExpensesByUserId('123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user/123`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should get all expenses', () => {
    service.getExpenses().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update expense', () => {
    const mockExpense = { id: '1', amount: 200 } as any;

    service.updateExpense('1', mockExpense).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockExpense);

    req.flush({});
  });

  it('should delete expense', () => {
    service.deleteExpense('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create expense', () => {
    const mockExpense = { amount: 999 } as any;

    service.setExpense(mockExpense).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockExpense);

    req.flush({});
  });
});