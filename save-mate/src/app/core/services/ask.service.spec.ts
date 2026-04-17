import { TestBed } from '@angular/core/testing';
import { AskService } from './ask.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AskService', () => {
  let service: AskService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/ask';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AskService]
    });

    service = TestBed.inject(AskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send question and return reply', () => {
    const mockResponse = { reply: 'Hello!' };

    service.ask('Hi').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/ask');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ question: 'Hi' });

    req.flush(mockResponse);
  });
});