import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { KnowledgeBaseService } from 'src/app/core/services/knowledge-base.service';
import { of } from 'rxjs';

describe('KnowledgeBaseComponent', () => {
  let component: KnowledgeBaseComponent;
  let fixture: ComponentFixture<KnowledgeBaseComponent>;
  let serviceSpy: jasmine.SpyObj<KnowledgeBaseService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('KnowledgeBaseService', ['getKnowledgeBases']);

    await TestBed.configureTestingModule({
      declarations: [KnowledgeBaseComponent],
      providers: [
        { provide: KnowledgeBaseService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeBaseComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set screen to mobile on resize <= 660', () => {
    (window as any).innerWidth = 500;

    component.onResize();

    expect(component.screen).toBe('mobile');
  });

  it('should set screen to desktop on resize > 660', () => {
    (window as any).innerWidth = 800;

    component.onResize();

    expect(component.screen).toBe('desktop');
  });

  it('should load articles on init and set activeTitle', () => {
    const mockData: any[] = [
      { id: '1', title: 'Article 1' },
      { id: '2', title: 'Article 2' }
    ];

    component.articles = mockData;
    component.activeTitle = mockData[0].title;

    serviceSpy.getKnowledgeBases.and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.articles.length).toBe(2);
    expect(component.activeTitle).toBe('Article 1');
  });

  it('should not fail if knowledgeBases is empty', () => {
    serviceSpy.getKnowledgeBases.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.articles).toEqual([]);
  });

  it('should update activeTitle on clickTitle', () => {
    const article: any = { id: '123', title: 'Test Article' };

    spyOn(component, 'scrollTo');

    component.onClickTitle(article);

    expect(component.activeTitle).toBe('Test Article');
    expect(component.scrollTo).toHaveBeenCalledWith('123');
  });

  it('should reset activeTitle on back click', () => {
    component.activeTitle = 'Something';

    component.onClickBack();

    expect(component.activeTitle).toBe('');
  });

  it('should call scrollIntoView if element exists', () => {
    const mockElement = {
      scrollIntoView: jasmine.createSpy('scrollIntoView')
    } as any;

    spyOn(document, 'getElementById').and.returnValue(mockElement);

    component.scrollTo('test-id');

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth'
    });
  });

  it('should not throw if element does not exist', () => {
    spyOn(document, 'getElementById').and.returnValue(null);

    expect(() => component.scrollTo('missing')).not.toThrow();
  });
});