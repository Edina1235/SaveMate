import { NotificationCategory } from "../enums/notification-category.enum";

export interface Notification {
    id: string;
    userId: string;
    title: string;
    text: string;
    category: NotificationCategory;
    createdAt: Date;
    isRead: boolean;
}

export interface NotificationToAdmin {
    id: string;
    email: string;
    title: string;
    text: string;
    category: NotificationCategory;
    createdAt: Date;
    isRead: boolean;
}