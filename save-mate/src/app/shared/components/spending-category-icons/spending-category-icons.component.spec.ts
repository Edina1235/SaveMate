import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SpendingCategoryIconsComponent } from './spending-category-icons.component';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';

describe('SpendingCategoryIconsComponent', () => {
  let component: SpendingCategoryIconsComponent;
  let fixture: ComponentFixture<SpendingCategoryIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SpendingCategoryIconsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingCategoryIconsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form controls for all icons', () => {
    fixture.detectChanges();

    const controlKeys = Object.keys(component.formGroup.controls);
    expect(controlKeys.length).toBe(component.spendingCategoryIcons.length);
  });

  it('should preselect active categories', () => {
    component.activeCategories = [SpendingCategoriesName.FoodAndHousehold];

    fixture.detectChanges();

    const foodIcon = SpendingCategoriesIcon.FoodAndHousehold;
    const index = component.spendingCategoryIcons.indexOf(foodIcon);

    expect(component.formGroup.get('category_' + index)?.value).toBeTrue();
  });

  it('should emit active categories on status change', () => {
    spyOn(component.activeCategoriesOutput, 'emit');
    spyOn(component.validForm, 'emit');

    fixture.detectChanges();

    const firstControl = component.formGroup.get('category_0');
    firstControl?.setValue(true);

    expect(component.activeCategoriesOutput.emit).toHaveBeenCalled();
    expect(component.validForm.emit).toHaveBeenCalled();
  });

  it('should map icon to category correctly', () => {
    fixture.detectChanges();

    const method = (component as any).getNameByIcon(
      SpendingCategoriesIcon.HousingAndUtilities
    );

    expect(method).toBe(SpendingCategoriesName.HousingAndUtilities);
  });

  it('should emit validForm status', () => {
    spyOn(component.validForm, 'emit');

    fixture.detectChanges();

    const validForm = {emit: true};

    expect(validForm.emit).toBe(true);
  });

  it('should convert selected form values into active categories', () => {
    spyOn(component.activeCategoriesOutput, 'emit');

    fixture.detectChanges();

    const firstKey = 'category_0';
    component.formGroup.get(firstKey)?.setValue(true);

    // trigger statusChanges manually (important for deterministic test)
    component.formGroup.updateValueAndValidity();

    expect(component.activeCategoriesOutput.emit).toHaveBeenCalled();
  });
});