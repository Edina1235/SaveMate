import { Component, Input, OnInit, Output } from '@angular/core';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-spending-category-icons',
  templateUrl: './spending-category-icons.component.html',
  styleUrls: ['./spending-category-icons.component.scss']
})
export class SpendingCategoryIconsComponent implements OnInit {
  @Input() public activeCategories: SpendingCategoriesName[] = [];
  @Output() public activeCategoriesOutput = new EventEmitter<SpendingCategoriesName[]>(); 
  @Output() public validForm = new EventEmitter<boolean>(); 
  public activeCategoryIcons: SpendingCategoriesIcon[] = [];
  public spendingCategoryIcons: SpendingCategoriesIcon[] = Object.values(SpendingCategoriesIcon);

  public formGroup: FormGroup = new FormGroup({});

  private readonly categoryIconMap: Map<SpendingCategoriesName, SpendingCategoriesIcon> = new Map([
    [SpendingCategoriesName.FoodAndHousehold, SpendingCategoriesIcon.FoodAndHousehold],
    [SpendingCategoriesName.HousingAndUtilities, SpendingCategoriesIcon.HousingAndUtilities],
    [SpendingCategoriesName.Transportation, SpendingCategoriesIcon.Transportation],
    [SpendingCategoriesName.EntertainmentAndLeisure, SpendingCategoriesIcon.EntertainmentAndLeisure],
    [SpendingCategoriesName.HealthAndPersonalExpenses, SpendingCategoriesIcon.HealthAndPersonalExpenses],
    [SpendingCategoriesName.ClothingAndOtherShopping, SpendingCategoriesIcon.ClothingAndOtherShopping],
    [SpendingCategoriesName.ChildrenPerFamily, SpendingCategoriesIcon.ChildrenPerFamily],
    [SpendingCategoriesName.LoansAndDebts, SpendingCategoriesIcon.LoansAndDebts],
    [SpendingCategoriesName.InsuranceAndFinancialProducts, SpendingCategoriesIcon.InsuranceAndFinancialProducts],
    [SpendingCategoriesName.SavingAndInvesting, SpendingCategoriesIcon.SavingAndInvesting],
    [SpendingCategoriesName.OtherPerVariableExpenses, SpendingCategoriesIcon.OtherPerVariableExpenses]
  ]);

  ngOnInit(): void {
    this.activeCategoryIcons = this.activeCategories.map(category => this.categoryIconMap.get(category)!).filter(icon => icon !== undefined) as SpendingCategoriesIcon[];
    for(let i = 0; i < this.spendingCategoryIcons.length; i++) {
      this.formGroup.addControl('category_' + i, new FormControl(this.activeCategoryIcons.includes(this.spendingCategoryIcons[i]) ? true : false, Validators.required));
    }

    this.formGroup.statusChanges.subscribe(() => {
      const activeCategories: SpendingCategoriesName[] = [];
      for(let i = 0; i < this.spendingCategoryIcons.length; i++) {
        if(this.formGroup.get('category_' + i)?.value) {
          const categoryName = this.getNameByIcon(this.spendingCategoryIcons[i]);
          if(categoryName) {
            activeCategories.push(categoryName as SpendingCategoriesName);
          }
        }
      }
      this.activeCategoriesOutput.emit(activeCategories);
      this.validForm.emit(this.formGroup.valid);
    });
  }

  private getNameByIcon(icon: SpendingCategoriesIcon): SpendingCategoriesName | undefined {
    switch (icon) {
      case SpendingCategoriesIcon.FoodAndHousehold:
        return SpendingCategoriesName.FoodAndHousehold;
      case SpendingCategoriesIcon.HousingAndUtilities:
        return SpendingCategoriesName.HousingAndUtilities;
      case SpendingCategoriesIcon.Transportation:
        return SpendingCategoriesName.Transportation;
      case SpendingCategoriesIcon.EntertainmentAndLeisure:
        return SpendingCategoriesName.EntertainmentAndLeisure;
      case SpendingCategoriesIcon.HealthAndPersonalExpenses:
        return SpendingCategoriesName.HealthAndPersonalExpenses;
      case SpendingCategoriesIcon.ClothingAndOtherShopping:
        return SpendingCategoriesName.ClothingAndOtherShopping;
      case SpendingCategoriesIcon.ChildrenPerFamily:
        return SpendingCategoriesName.ChildrenPerFamily;
      case SpendingCategoriesIcon.LoansAndDebts:
        return SpendingCategoriesName.LoansAndDebts;
      case SpendingCategoriesIcon.InsuranceAndFinancialProducts:
        return SpendingCategoriesName.InsuranceAndFinancialProducts;
      case SpendingCategoriesIcon.SavingAndInvesting:
        return SpendingCategoriesName.SavingAndInvesting;
      case SpendingCategoriesIcon.OtherPerVariableExpenses:
        return SpendingCategoriesName.OtherPerVariableExpenses;
      default:
        return undefined;
    }
  }
}
