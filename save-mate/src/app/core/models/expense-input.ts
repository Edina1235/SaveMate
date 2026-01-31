import { SpendingCategoriesName } from "../enums/spending-categories-name.enum";

export interface ExpenseInput {
    category: SpendingCategoriesName,
    amount: number
}