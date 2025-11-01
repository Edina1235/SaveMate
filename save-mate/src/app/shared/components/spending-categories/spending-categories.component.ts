import { Component } from '@angular/core';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';

@Component({
  selector: 'app-spending-categories',
  templateUrl: './spending-categories.component.html',
  styleUrls: ['./spending-categories.component.scss']
})
export class SpendingCategoriesComponent {
  public categories: SpendingCategoriesName[] = Object.values(SpendingCategoriesName);
  public categoriesIcon: SpendingCategoriesIcon[] = Object.values(SpendingCategoriesIcon); 
  public activeCategory?: SpendingCategoriesName;

  public onClickArrow(category: SpendingCategoriesName) {
    if (category === this.activeCategory) {
      this.activeCategory = undefined;
    } else {
      this.activeCategory = category;
    }
  }
}
