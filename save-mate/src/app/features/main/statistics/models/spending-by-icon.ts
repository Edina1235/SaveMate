import { SpendingCategoriesColor } from "src/app/core/enums/spending-categories-color.enum";
import { SpendingCategoriesIcon } from "src/app/core/enums/spending-categories-icon.enum";

export interface SpendingByIcon {
    icon: SpendingCategoriesIcon,
    percent: number,
    color: SpendingCategoriesColor
}