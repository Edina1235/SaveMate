export interface Debt {
    id: string;
    userId: string;
    name: string;
    totalAmount: number;
    monthlyPayment: number;
    interest: number;
    dueDate: Date;
    hasArrears: boolean;
    prepaymentAllowed: boolean;
}
