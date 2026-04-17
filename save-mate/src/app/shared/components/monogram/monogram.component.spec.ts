import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonogramComponent } from './monogram.component';
import { FirstLetterPipe } from '../../pipe/first-letter.pipe';

describe('MonogramComponent', () => {
  let component: MonogramComponent;
  let fixture: ComponentFixture<MonogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonogramComponent, FirstLetterPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(MonogramComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default firstName and lastName', () => {
    expect(component.firstName).toBe('Edina');
    expect(component.lastName).toBe('Tóth');
  });

  it('should accept input values', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';

    fixture.detectChanges();

    expect(component.firstName).toBe('John');
    expect(component.lastName).toBe('Doe');
  });

  it('should allow fontsize input', () => {
    component.fontsize = '24px';

    fixture.detectChanges();

    expect(component.fontsize).toBe('24px');
  });
});