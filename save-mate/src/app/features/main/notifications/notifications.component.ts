import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/core/components/header/header.service';
import { NotificationCategory } from 'src/app/core/enums/notification-category.enum';
import { Notification } from 'src/app/core/models/notification';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  public screen: 'mobile' | 'desktop' = 'desktop';
  public notifications: Notification[] = [];
  public categories: NotificationCategory[] = Object.values(NotificationCategory);
  public activeCategory?: NotificationCategory;

  public NotificationCategory = NotificationCategory;

  constructor(private notificationService: NotificationService,
              private headerService: HeaderService,
              private toastService: ToastService
  ) {}

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
    this.notificationService.getNotifications().subscribe({next: notifications => {
      this.notifications = (notifications as Notification[]).reverse();
    }, error: error => console.error(error)});
  }

  public onClickDelete(id: string) {
    this.notificationService.deleteNotification(id).subscribe({next: () => {
      this.notifications = this.notifications.filter(notification => notification.id !== id);
      this.headerService.loadNotifications();
      this.toastService.successToastr("Siker", "Sikeres törlés");
    }, error: error => console.error(error)});
  }

  public onClickReadStatus(id: string) {
    const index = this.notifications.findIndex(notification => notification.id === id);
    this.notifications[index].isRead = !this.notifications[index].isRead;
    this.notificationService.updateNotification(id, this.notifications[index]).subscribe({next: () => {
      this.headerService.loadNotifications();
      this.toastService.successToastr("Siker", "Sikeres állapotfrissítés");
    }, error: error => console.error(error)});
  }

  public onClickCategory(category: NotificationCategory) {
    this.activeCategory = category;
  }

  public onClickBack() {
    this.activeCategory = undefined;
  }
}
