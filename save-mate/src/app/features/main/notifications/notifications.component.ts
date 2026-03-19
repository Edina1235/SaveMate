import { Component, HostListener, OnInit } from '@angular/core';
import { NotificationCategory } from 'src/app/core/enums/notification-category.enum';
import { Notification } from 'src/app/core/models/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  public screen: 'mobile' | 'desktop' = 'desktop';
  public notifications: Notification[] = [{
    title: 'valami',
    text: 'k',
    category: NotificationCategory.MonthlySummary,
    id: '1',
    userId: '1',
    isRead: true,
    createdAt: new Date()
  }, {
    title: 'valami',
    text: 'k',
    category: NotificationCategory.Reminders,
    id: '2',
    userId: '1',
    isRead: true,
    createdAt: new Date()
  }, {
    title: 'valami',
    text: 'k',
    category: NotificationCategory.Suggestions,
    id: '3',
    userId: '1',
    isRead: true,
    createdAt: new Date()
  }, {
    title: 'valami',
    text: 'k',
    category: NotificationCategory.SysmtemMessages,
    id: '4',
    userId: '1',
    isRead: true,
    createdAt: new Date()
  }];
  public categories: NotificationCategory[] = Object.values(NotificationCategory);
  public activeCategory?: NotificationCategory;

  public NotificationCategory = NotificationCategory;

  @HostListener('window:resize')
  onResize() {
    if(window.innerWidth <= 660) {
      this.screen = 'mobile';
    } else {
      this.screen = 'desktop';
      this.activeCategory = NotificationCategory.All;
    }
  }

  ngOnInit(): void {
      this.onResize();
  }

  public onClickDelete(id: string) {
    this.notifications = this.notifications.filter(notification => notification.id !== id);
  }

  public onClickReadStatus(id: string) {
    const index = this.notifications.findIndex(notification => notification.id === id);
    this.notifications[index].isRead = !this.notifications[index].isRead;
  }

  public onClickCategory(category: NotificationCategory) {
    this.activeCategory = category;
  }

  public onClickBack() {
    this.activeCategory = undefined;
  }
}
