import { AfterViewInit, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ContactCategory } from 'src/app/core/enums/contact-category.enum';
import { NotificationCategory } from 'src/app/core/enums/notification-category.enum';
import { ContactMessage, ContactMessageToAdmin } from 'src/app/core/models/contact-message';
import { NotificationToAdmin } from 'src/app/core/models/notification';
import { Role, User } from 'src/app/core/models/user';
import { UserModifyDialogComponent } from './dialogs/user-modify-dialog/user-modify-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { NewNotificationDialogComponent } from './dialogs/new-notification-dialog/new-notification-dialog.component';
import { UserDetailsDialogComponent } from './dialogs/user-details-dialog/user-details-dialog.component';
import { KnowledgeBase } from 'src/app/core/models/knowledge-base';
import { KnowledgeBaseModifyDialogComponent } from './dialogs/knowledge-base-modify-dialog/knowledge-base-modify-dialog.component';
import { SpendingCategoriesColor } from 'src/app/core/enums/spending-categories-color.enum';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { NewKnowledgeBaseDialogComponent } from './dialogs/new-knowledge-base-dialog/new-knowledge-base-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit {
  public displayedColumns: string[] = ['id', 'email', 'firstname', 'lastname', 'nickname', 'registrationDate', 'lastLoginDate', 'role', 'action'];
  public displayedContactColumns: string[] = ['id', 'email', 'category', 'message', 'date'];
  public displayedNotificationColumns: string[] = ['id', 'email', 'title', 'text', 'category', 'createdAt', 'isRead'];
  public displayedKnowledgeBaseColumns: string[] = ['id', 'title', 'text', 'updateDate', 'resourceLink', 'action'];

  public users: User[] = [
    {id: '1', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [SpendingCategoriesName.ChildrenPerFamily, SpendingCategoriesName.ClothingAndOtherShopping, SpendingCategoriesName.EntertainmentAndLeisure], fixSpendingCategories: [SpendingCategoriesName.ChildrenPerFamily, SpendingCategoriesName.ClothingAndOtherShopping, SpendingCategoriesName.EntertainmentAndLeisure], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '2', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '3', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '4', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '5', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '6', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '7', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '8', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '9', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '10', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '11', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '12', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '13', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '14', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '15', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
    {id: '16', email: 'tothedina2003@gmail.com', firstname: 'Edina', lastname: 'Tóth', nickname: 'Edi', passwordHash: '', avatarId: '1', registrationDate: new Date(), lastLoginDate: new Date(), isGlobalNotificationsEnabled: true, topSpendingCategories: [], fixSpendingCategories: [], avgMonthlyFixedCosts: 1, role: Role.User},
  ];
  public dataSource = new MatTableDataSource<User>(this.users);

  public contactMessages: ContactMessageToAdmin[] = [
    {id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', category: ContactCategory.bugReport, message: 'jdfnjcn irjgudikj frjvgidjg ofrdx jgoj gojcfbgv cbocdfokjb ofclkbgolkj bgopcéj bgjc lbj ob jlégckjfm élgkcvmblo ckvgbnlkjmooln jmoglb kmnolgk jcnolgbkin kgolné kjoplkc ngvocf vgkéoplgck vblo kbnohbk vmé', date: new Date()},
    {id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', category: ContactCategory.bugReport, message: 'jdfnjcn', date: new Date()},
    {id: '1', email: this.users.find(user => user.id === '2')?.email ?? '', category: ContactCategory.bugReport, message: 'jdfnjcn', date: new Date()},
    {id: '1', email: this.users.find(user => user.id === '3')?.email ?? '', category: ContactCategory.bugReport, message: 'jdfnjcn', date: new Date()},
    {id: '1', email: this.users.find(user => user.id === '4')?.email ?? '', category: ContactCategory.bugReport, message: 'jdfnjcn', date: new Date()},
    {id: '1', email: this.users.find(user => user.id === '5')?.email ?? '', category: ContactCategory.bugReport, message: 'jdfnjcn', date: new Date()},
    {id: '1', email: this.users.find(user => user.id === '6')?.email ?? '', category: ContactCategory.bugReport, message: 'jdfnjcn', date: new Date()},
    {id: '1', email: this.users.find(user => user.id === '7')?.email ?? '', category: ContactCategory.bugReport, message: 'jdfnjcn', date: new Date()},
    {id: '1', email: this.users.find(user => user.id === '8')?.email ?? '', category: ContactCategory.bugReport, message: 'jdfnjcn', date: new Date()},
  ];
  public contactDataSource = new MatTableDataSource<ContactMessageToAdmin>(this.contactMessages);

  public notifications: NotificationToAdmin[] = [
    { id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', title: 'Valami', text: 'Valami text', category: NotificationCategory.MonthlySummary, createdAt: new Date(), isRead: true },
    { id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', title: 'Valami', text: 'Valami text', category: NotificationCategory.MonthlySummary, createdAt: new Date(), isRead: true },
    { id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', title: 'Valami', text: 'Valami text', category: NotificationCategory.MonthlySummary, createdAt: new Date(), isRead: true },
    { id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', title: 'Valami', text: 'Valami text', category: NotificationCategory.MonthlySummary, createdAt: new Date(), isRead: true },
    { id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', title: 'Valami', text: 'Valami text', category: NotificationCategory.MonthlySummary, createdAt: new Date(), isRead: true },
    { id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', title: 'Valami', text: 'Valami text', category: NotificationCategory.MonthlySummary, createdAt: new Date(), isRead: true },
    { id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', title: 'Valami', text: 'Valami text', category: NotificationCategory.MonthlySummary, createdAt: new Date(), isRead: true },
    { id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', title: 'Valami', text: 'Valami text', category: NotificationCategory.MonthlySummary, createdAt: new Date(), isRead: true },
    { id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', title: 'Valami', text: 'Valami text', category: NotificationCategory.MonthlySummary, createdAt: new Date(), isRead: true },
    { id: '1', email: this.users.find(user => user.id === '1')?.email ?? '', title: 'Valami', text: 'Valami text', category: NotificationCategory.MonthlySummary, createdAt: new Date(), isRead: true },
  ];
  public notificationDataSource = new MatTableDataSource<NotificationToAdmin>(this.notifications);

  public knowledgeBaseArray: KnowledgeBase[] = [
    {id: '1', title: 'Title', text: 'Text', updateDate: new Date(), resourceLink: 'www.valami.com'},
    {id: '1', title: 'Title', text: 'Text', updateDate: new Date(), resourceLink: 'www.valami.com'},
    {id: '1', title: 'Title', text: 'Text', updateDate: new Date(), resourceLink: 'www.valami.com'},
    {id: '1', title: 'Title', text: 'Text', updateDate: new Date(), resourceLink: 'www.valami.com'},
    {id: '1', title: 'Title', text: 'Text', updateDate: new Date(), resourceLink: 'www.valami.com'},
    {id: '1', title: 'Title', text: 'Text', updateDate: new Date(), resourceLink: 'www.valami.com'},
    {id: '1', title: 'Title', text: 'Text', updateDate: new Date(), resourceLink: 'www.valami.com'},
    {id: '1', title: 'Title', text: 'Text', updateDate: new Date(), resourceLink: 'www.valami.com'},
    {id: '1', title: 'Title', text: 'Text', updateDate: new Date(), resourceLink: 'www.valami.com'},
    {id: '1', title: 'Title', text: 'Text', updateDate: new Date(), resourceLink: 'www.valami.com'},
  ];
  public knowledgeBaseDataSource = new MatTableDataSource<KnowledgeBase>(this.knowledgeBaseArray);

  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginators.toArray()[0];
    this.contactDataSource.paginator = this.paginators.toArray()[1];
    this.notificationDataSource.paginator = this.paginators.toArray()[2];
    this.knowledgeBaseDataSource.paginator = this.paginators.toArray()[3];
  }

  constructor(private dialog: MatDialog) {}

  public onClickModify(id: string) {
    this.dialog.open(UserModifyDialogComponent, {
      data: this.users.find(user => user.id === id),
      autoFocus: false
    });
  }

  public onClickDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Biztosan törli a felhasználót?',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(value => {
      if(value)
        console.log("delete");
    });
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
    });
  }

  public onClickNewKnowledgeBase() {
    this.dialog.open(NewKnowledgeBaseDialogComponent, {
      autoFocus: false
    });
  }

  public onClickKnowledgeModify(id: string) {
    this.dialog.open(KnowledgeBaseModifyDialogComponent, {
      data: this.knowledgeBaseArray.find(knowledgeBase => knowledgeBase.id === id),
      autoFocus: false
    });
  }

  public onClickKnowledgeDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Biztosan törli a cikket?',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(value => {
      if(value)
        console.log("delete");
    });
  }
}
