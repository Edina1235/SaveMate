import { TestBed } from '@angular/core/testing';
import { ConfigurationService } from './configuration.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/configuration';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService]
    });

    service = TestBed.inject(ConfigurationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get configuration by id', () => {
    service.getConfiguration('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get all configurations', () => {
    service.getConfigurations().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update configuration', () => {
    const mockConfig = { id: '1' } as any;

    service.updateConfiguration('1', mockConfig).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockConfig);

    req.flush({});
  });

  it('should delete configuration', () => {
    service.deleteConfiguration('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create configuration', () => {
    const mockConfig = { name: 'test' } as any;

    service.setConfiguration(mockConfig).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockConfig);

    req.flush({});
  });
});