
import { SpendingCategoriesName } from "../enums/spending-categories-name.enum";

export interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    nickname: string;
    passwordHash: string;
    avatarId: string | null;
    registrationDate: Date;
    lastLoginDate: Date;
    isGlobalNotificationsEnabled: boolean;
    topSpendingCategories: SpendingCategoriesName[];
    fixSpendingCategories: SpendingCategoriesName[];
    avgMonthlyFixedCosts: number;
    role: Role;
}

export enum Role {
    Admin = "Admin",
    User = "Felhasználó"
}
