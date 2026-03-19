import { Component } from '@angular/core';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';

@Component({
  selector: 'app-spending-category-icons',
  templateUrl: './spending-category-icons.component.html',
  styleUrls: ['./spending-category-icons.component.scss']
})
export class SpendingCategoryIconsComponent {
  public spendingCategoryIcons: SpendingCategoriesIcon[] = Object.values(SpendingCategoriesIcon);
  //TODO Input Output megvalósítás
}
