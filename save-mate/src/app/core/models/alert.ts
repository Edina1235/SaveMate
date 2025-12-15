export interface Alert {
    id: string;
    userId: string;
    type: string;
    conditions: Map<string, any>;
    title: string;
    text: string;
    isEnabled: boolean;
    createdAt: Date;
}
