import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.activeCategory = SpendingCategoriesName.HousingAndUtilities;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate details for HousingAndUtilities', () => {
    component.activeCategory = SpendingCategoriesName.HousingAndUtilities;

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.details.length).toBe(8);
    expect(component.details).toContain('Villany');
    expect(component.details).toContain('Internet');
  });

  it('should populate details for Transportation', () => {
    component.activeCategory = SpendingCategoriesName.Transportation;

    fixture.detectChanges();

    expect(component.details.length).toBe(7);
    expect(component.details).toContain('Benzin, gázolaj, töltés');
  });

  it('should populate details for SavingAndInvesting', () => {
    component.activeCategory = SpendingCategoriesName.SavingAndInvesting;

    fixture.detectChanges();

    expect(component.details.length).toBe(4);
    expect(component.details).toContain('Vésztartalék, félretett pénz');
  });

  it('should update details when category changes and ngOnInit runs', () => {
    component.activeCategory = SpendingCategoriesName.LoansAndDebts;

    fixture.detectChanges();

    expect(component.details.length).toBe(4);
    expect(component.details).toContain('Személyi kölcsön');
  });
});