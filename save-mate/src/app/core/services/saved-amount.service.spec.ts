import { TestBed } from '@angular/core/testing';
import { SavedAmountService } from './saved-amount.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SavedAmountService', () => {
  let service: SavedAmountService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/saved-amount';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SavedAmountService]
    });

    service = TestBed.inject(SavedAmountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get saved amount by id', () => {
    service.getSavedAmount('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get saved amounts by user id', () => {
    service.getSavedAmountsByUserId('123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user/123`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should get all saved amounts', () => {
    service.getSavedAmounts().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update saved amount', () => {
    const mockSaved = { id: '1', amount: 500 } as any;

    service.updateSavedAmount('1', mockSaved).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSaved);

    req.flush({});
  });

  it('should delete saved amount', () => {
    service.deleteSavedAmount('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create saved amount', () => {
    const mockSaved = { amount: 1000 } as any;

    service.setSavedAmount(mockSaved).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSaved);

    req.flush({});
  });
});