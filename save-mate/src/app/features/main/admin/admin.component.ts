import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ContactMessage, ContactMessageToAdmin } from 'src/app/core/models/contact-message';
import { Notification, NotificationToAdmin } from 'src/app/core/models/notification';
import { User } from 'src/app/core/models/user';
import { UserModifyDialogComponent } from './dialogs/user-modify-dialog/user-modify-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { NewNotificationDialogComponent } from './dialogs/new-notification-dialog/new-notification-dialog.component';
import { UserDetailsDialogComponent } from './dialogs/user-details-dialog/user-details-dialog.component';
import { KnowledgeBase } from 'src/app/core/models/knowledge-base';
import { KnowledgeBaseModifyDialogComponent } from './dialogs/knowledge-base-modify-dialog/knowledge-base-modify-dialog.component';
import { NewKnowledgeBaseDialogComponent } from './dialogs/new-knowledge-base-dialog/new-knowledge-base-dialog.component';
import { KnowledgeBaseService } from 'src/app/core/services/knowledge-base.service';
import { UserService } from 'src/app/core/services/user.service';
import { ContactMessageService } from 'src/app/core/services/contact-message.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public displayedColumns: string[] = ['email', 'firstname', 'lastname', 'nickname', 'registrationDate', 'lastLoginDate', 'role', 'action'];
  public displayedContactColumns: string[] = ['email', 'category', 'message', 'date'];
  public displayedNotificationColumns: string[] = ['email', 'title', 'text', 'category', 'createdAt', 'isRead'];
  public displayedKnowledgeBaseColumns: string[] = ['title', 'text', 'updateDate', 'resourceLink', 'action'];

  public users: User[] = [];
  public dataSource?: MatTableDataSource<User>;

  public contactMessages: ContactMessageToAdmin[] = [];
  public contactDataSource?: MatTableDataSource<ContactMessageToAdmin>;

  public notifications: NotificationToAdmin[] = [];
  public notificationDataSource?: MatTableDataSource<NotificationToAdmin>;

  public knowledgeBaseArray: KnowledgeBase[] = [];
  public knowledgeBaseDataSource?: MatTableDataSource<KnowledgeBase>;

  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;

  ngOnInit(): void {
    this.getKnowledgeBases();
    this.getUsers();
  }

  constructor(private dialog: MatDialog,
              private knowledgeBaseService: KnowledgeBaseService,
              private userService: UserService,
              private contactMessageService: ContactMessageService,
              private notificationService: NotificationService,
              private toastService: ToastService
  ) {}

  public onClickModify(id: string) {
    this.dialog.open(UserModifyDialogComponent, {
      data: this.users.find(user => user.id === id),
      autoFocus: false
    }).afterClosed().subscribe({next: () => {
      this.getUsers();
    }, error: error => console.error(error)});
  }

  public onClickDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Biztosan törli a felhasználót?',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe({next: value => {
      if(value)
        this.userService.deleteUser(id).subscribe({next: () => {
          this.getUsers();
          this.toastService.successToastr("Siker", "Sikeres törlés");
        }, error: error => console.error(error)});
    }, error: error => console.error(error)});
  }

  public onClickMore(id: string) {
    this.dialog.open(UserDetailsDialogComponent, {
      data: this.users.find(user => user.id === id),
      autoFocus: false
    });
  }

  public onClickNewNotification() {
    this.dialog.open(NewNotificationDialogComponent, {
      autoFocus: false
    }).afterClosed().subscribe({next: () => this.getNotifications(), error: error => console.error(error)});
  }

  public onClickNewKnowledgeBase() {
    this.dialog.open(NewKnowledgeBaseDialogComponent, {
      autoFocus: false
    }).afterClosed().subscribe({next: () => {
      this.getKnowledgeBases();
    }, error: error => console.error(error)});
  }

  public onClickKnowledgeModify(id: string) {
    this.dialog.open(KnowledgeBaseModifyDialogComponent, {
      data: this.knowledgeBaseArray.find(knowledgeBase => knowledgeBase.id === id),
      autoFocus: false
    }).afterClosed().subscribe({next: () => {
      this.getKnowledgeBases();
    }, error: error => console.error(error)});
  }

  public onClickKnowledgeDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Biztosan törli a cikket?',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe({next: value => {
      if(value) {
        this.knowledgeBaseService.deleteKnowledgeBase(id).subscribe({next: () => {
          this.getKnowledgeBases();
          this.toastService.successToastr("Siker", "Sikeres törlés");
        }, error: error => console.error(error)});
      }
    }, error: error => console.error(error)});
  }

  private getKnowledgeBases() {
    this.knowledgeBaseService.getKnowledgeBases().subscribe({next: knowledgeBases => {
      this.knowledgeBaseArray = knowledgeBases as KnowledgeBase[];
      this.knowledgeBaseDataSource = new MatTableDataSource<KnowledgeBase>(this.knowledgeBaseArray);
      this.knowledgeBaseDataSource.paginator = this.paginators.toArray()[3];
    }, error: error => console.error(error)});
  }

  private getUsers() {
    this.userService.getUsers().subscribe({next: users => {
      this.users = users as User[];
      this.dataSource = new MatTableDataSource<User>(this.users);
      this.dataSource.paginator = this.paginators.toArray()[0];
      this.getNotifications();
      this.getContactMessages();
    }, error: error => console.error(error)});
  }

  private getNotifications() {
    this.notifications = [];
    this.notificationService.getNotifications().subscribe({next: notifications => {
      const previous = notifications as Notification[];
      previous.forEach(notification => {
        const user = this.users.find(user => user.id === notification.userId);
        if(user)
        this.notifications.push({
          email: user.email,
          ...notification
        });
      });
      this.notificationDataSource = new MatTableDataSource<NotificationToAdmin>(this.notifications);
      this.notificationDataSource.paginator = this.paginators.toArray()[2];
    }, error: error => console.error(error)});
  }

  private getContactMessages() {
    this.contactMessages = [];
    this.contactMessageService.getContactMessages().subscribe({ next: contactMessages => {
      const previous = contactMessages as ContactMessage[];
      previous.forEach(contactMessage => {
        const user = this.users.find(user => user.id === contactMessage.userId);
        if(user)
        this.contactMessages.push({
          email: user.email,
          ...contactMessage
        });
      });
      this.contactDataSource = new MatTableDataSource<ContactMessageToAdmin>(this.contactMessages);
      this.contactDataSource.paginator = this.paginators.toArray()[1];
    }, error: error => console.error(error)});
  }
}
