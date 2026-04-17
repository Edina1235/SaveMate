import { NotificationCategory } from "../enums/notification-category.enum";

export interface Alert {
    id: string;
    userId: string;
    type: NotificationCategory;
    condition: AlertCondition;
    conditionValue: number;
    title: string;
    text: string;
    isEnabled: boolean;
    createdAt: Date;
}

export enum AlertCondition {
    MonthlySpendingLimit = 'Havi költési limit',
    WeeklySpendingLimit = 'Heti költési limit',
    DailySpendingLimit = 'Napi költési limit',
    CategorySpendingLimit = 'Kategória költési limit',
    SavingGoalProgress = 'Megtakarítási cél előrehaladása',
    BillDueDate = 'Számla befizetés határideje',
    DebtDueDate = 'Tartozás határideje'
}
