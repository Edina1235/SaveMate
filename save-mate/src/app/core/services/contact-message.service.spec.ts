import { TestBed } from '@angular/core/testing';
import { ContactMessageService } from './contact-message.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ContactMessageService', () => {
  let service: ContactMessageService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/contact-messages';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactMessageService]
    });

    service = TestBed.inject(ContactMessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get contact message by id', () => {
    service.getContactMessage('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get all contact messages', () => {
    service.getContactMessages().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update contact message', () => {
    const mockMessage = { id: '1', text: 'hello' } as any;

    service.updateContactMessage('1', mockMessage).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockMessage);

    req.flush({});
  });

  it('should delete contact message', () => {
    service.deleteContactMessage('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create contact message', () => {
    const mockMessage = { text: 'test' } as any;

    service.setContactMessage(mockMessage).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockMessage);

    req.flush({});
  });
});