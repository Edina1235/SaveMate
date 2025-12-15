export interface RecurringExpense {
    id: string;
    userId: string;
    name: string;
    category: string;
    amount: number;
    isAutoReminderEnabled: boolean;
}
