export interface ContactMessage {
    id: string;
    userId: string;
    category: string;
    message: string;
    date: Date;
}

export interface ContactMessageToAdmin {
    id: string;
    email: string;
    category: string;
    message: string;
    date: Date;
}
