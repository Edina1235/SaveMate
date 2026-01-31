import { SpendingCategoriesName } from "../enums/spending-categories-name.enum";

export interface SpendingByCategory {
    category: SpendingCategoriesName,
    amount: number
}