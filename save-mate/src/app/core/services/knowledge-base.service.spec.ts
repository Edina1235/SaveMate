import { TestBed } from '@angular/core/testing';
import { KnowledgeBaseService } from './knowledge-base.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('KnowledgeBaseService', () => {
  let service: KnowledgeBaseService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/knowledge-base';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KnowledgeBaseService]
    });

    service = TestBed.inject(KnowledgeBaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get knowledge base by id', () => {
    service.getKnowledgeBase('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get all knowledge bases', () => {
    service.getKnowledgeBases().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update knowledge base', () => {
    const mockKb = { id: '1', title: 'test' } as any;

    service.updateKnowledgeBase('1', mockKb).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockKb);

    req.flush({});
  });

  it('should delete knowledge base', () => {
    service.deleteKnowledgeBase('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create knowledge base', () => {
    const mockKb = { title: 'test' } as any;

    service.setKnowledgeBase(mockKb).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockKb);

    req.flush({});
  });
});