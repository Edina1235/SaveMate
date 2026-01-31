export interface Goal {
    id: string;
    userId: string;
    target: string[];
    targetAmount: number;
    savedAmount: number;
    deadline: Date;
}
