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
    globalNotificationsLastSeenAt: Date;
    isGlobalNotificationsEnabled: boolean;
    topSpendingCategories: string[];
    fixSpendingCategories: string[];
    avgMonthlyFixedCosts: number;
}
