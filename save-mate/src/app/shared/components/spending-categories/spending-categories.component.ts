import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';

@Component({
  selector: 'app-spending-categories',
  templateUrl: './spending-categories.component.html',
  styleUrls: ['./spending-categories.component.scss']
})
export class SpendingCategoriesComponent implements OnInit {
  @Input() activeCategories: SpendingCategoriesName[] = [];
  @Output() selectedCategories = new EventEmitter<SpendingCategoriesName[]>();
  public categories: SpendingCategoriesName[] = Object.values(SpendingCategoriesName);
  public categoriesIcon: SpendingCategoriesIcon[] = Object.values(SpendingCategoriesIcon); 
  public activeCategory?: SpendingCategoriesName;

  public spendingCategoriesGroup: FormGroup = new FormGroup({});

  ngOnInit(): void {
    for(let i = 0; i < this.categories.length; i++) {
      this.spendingCategoriesGroup.addControl(`${i}`, new FormControl(''));
    }

    this.spendingCategoriesGroup.valueChanges.subscribe(categoryValues => {
      this.activeCategories = [];
      Object.keys(categoryValues).forEach(key => {
        if(categoryValues[key]) this.activeCategories.push(this.categories[Number(key)]);
      });
      this.selectedCategories.emit(this.activeCategories);
    });
  }

  public onClickArrow(category: SpendingCategoriesName) {
    if (category === this.activeCategory) {
      this.activeCategory = undefined;
    } else {
      this.activeCategory = category;
    }
  }
}
