import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SpendingCategoriesComponent } from './spending-categories.component';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';

describe('SpendingCategoriesComponent', () => {
  let component: SpendingCategoriesComponent;
  let fixture: ComponentFixture<SpendingCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SpendingCategoriesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingCategoriesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form controls for all categories', () => {
    fixture.detectChanges();

    const controlKeys = Object.keys(component.spendingCategoriesGroup.controls);
    expect(controlKeys.length).toBe(component.categories.length);
  });

  it('should emit selected categories when form changes', () => {
    spyOn(component.selectedCategories, 'emit');

    fixture.detectChanges();

    const firstCategoryKey = '0';
    component.spendingCategoriesGroup.get(firstCategoryKey)?.setValue(true);

    expect(component.selectedCategories.emit).toHaveBeenCalled();
  });

  it('should set activeCategories from input on init', () => {
    component.activeCategories = [SpendingCategoriesName.HousingAndUtilities];

    fixture.detectChanges();

    const values = component.spendingCategoriesGroup.value;
    expect(Object.values(values).some(v => v === 'true')).toBeTrue();
  });

  it('should toggle activeCategory when clicking arrow', () => {
    const category = component.categories[0];

    component.onClickArrow(category);
    expect(component.activeCategory).toBe(category);

    component.onClickArrow(category);
    expect(component.activeCategory).toBeUndefined();
  });

  it('should update activeCategories from form valueChanges', () => {
    fixture.detectChanges();

    const firstKey = '0';
    component.spendingCategoriesGroup.get(firstKey)?.setValue(true);

    expect(component.activeCategories.length).toBeGreaterThan(0);
  });
});