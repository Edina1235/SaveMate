import { TestBed } from '@angular/core/testing';
import { RecurringExpenseService } from './recurring-expense.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('RecurringExpenseService', () => {
  let service: RecurringExpenseService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/recurring-expenses';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecurringExpenseService]
    });

    service = TestBed.inject(RecurringExpenseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get recurring expense by id', () => {
    service.getRecurringExpense('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get recurring expenses by user id', () => {
    service.getRecurringExpensesByUserId('123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user/123`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should get all recurring expenses', () => {
    service.getRecurringExpenses().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update recurring expense', () => {
    const mockExpense = { id: '1', amount: 100 } as any;

    service.updateRecurringExpense('1', mockExpense).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockExpense);

    req.flush({});
  });

  it('should delete recurring expense', () => {
    service.deleteRecurringExpense('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create recurring expense', () => {
    const mockExpense = { amount: 250 } as any;

    service.setRecurringExpense(mockExpense).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockExpense);

    req.flush({});
  });
});