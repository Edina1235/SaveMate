import { TestBed } from '@angular/core/testing';
import { GoalService } from './goal.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('GoalService', () => {
  let service: GoalService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/goals';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GoalService]
    });

    service = TestBed.inject(GoalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get goal by id', () => {
    service.getGoal('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get goals by user id', () => {
    service.getGoalsByUserId('123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user/123`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should get all goals', () => {
    service.getGoals().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should update goal', () => {
    const mockGoal = { id: '1', name: 'test' } as any;

    service.updateGoal('1', mockGoal).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockGoal);

    req.flush({});
  });

  it('should delete goal', () => {
    service.deleteGoal('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should create goal', () => {
    const mockGoal = { name: 'test' } as any;

    service.setGoal(mockGoal).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockGoal);

    req.flush({});
  });
});