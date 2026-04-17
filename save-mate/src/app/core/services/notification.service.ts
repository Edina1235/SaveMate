import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
private backendLink: string = "http://localhost:3000/notifications";

  constructor(private http: HttpClient) { }

  public getNotification(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getNotificationsByUserId(userId: string) {
      return this.http.get(`${this.backendLink}/user/${userId}`);
  }

  public getNotifications() {
    return this.http.get(this.backendLink);
  }

  public updateNotification(id: string, notification: Notification) {
    return this.http.put(`${this.backendLink}/${id}`, notification);
  }

  public deleteNotification(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setNotification(notification: Notification) {
    return this.http.post(this.backendLink, notification);
  }
}
