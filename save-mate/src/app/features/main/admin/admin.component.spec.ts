import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { KnowledgeBaseService } from 'src/app/core/services/knowledge-base.service';
import { ContactMessageService } from 'src/app/core/services/contact-message.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { fakeAsync, tick } from '@angular/core/testing';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  const dialogMock = {
    open: jasmine.createSpy().and.returnValue({
      afterClosed: () => of(true)
    })
  };

  const userServiceMock = {
    getUsers: jasmine.createSpy().and.returnValue(of([
      { id: '1', email: 'a@test.com' }
    ])),
    deleteUser: jasmine.createSpy().and.returnValue(of({}))
  };

  const knowledgeBaseServiceMock = {
    getKnowledgeBases: jasmine.createSpy().and.returnValue(of([
      { id: '1', title: 't', text: 'x', resourceLink: 'r', updateDate: new Date() }
    ])),
    deleteKnowledgeBase: jasmine.createSpy().and.returnValue(of({}))
  };

  const contactMessageServiceMock = {
    getContactMessages: jasmine.createSpy().and.returnValue(of([
      { id: '1', userId: '1', message: 'hi', category: 'c', date: new Date() }
    ]))
  };

  const notificationServiceMock = {
    getNotifications: jasmine.createSpy().and.returnValue(of([
      { id: '1', userId: '1', title: 't', text: 'x', category: 'c', createdAt: new Date(), isRead: false }
    ]))
  };

  const toastServiceMock = {
    successToastr: jasmine.createSpy()
  };

  const paginatorMock = { page: of({}), initialized: of(null) };
  const paginatorsMock = jasmine.createSpyObj('QueryList', ['toArray']);
  paginatorsMock.toArray.and.returnValue([paginatorMock, paginatorMock, paginatorMock, paginatorMock]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [MatTableModule, MatPaginatorModule],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: KnowledgeBaseService, useValue: knowledgeBaseServiceMock },
        { provide: ContactMessageService, useValue: contactMessageServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    (component as any).paginators = paginatorsMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(userServiceMock.getUsers).toHaveBeenCalled();
  }));

  it('should open modify dialog', () => {
    component.users = [{ id: '1', email: 'a@test.com' } as any];

    component.onClickModify('1');

    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should delete user when confirmed', () => {
    component.users = [{ id: '1', email: 'a@test.com' } as any];

    component.onClickDelete('1');

    expect(userServiceMock.deleteUser).toHaveBeenCalled();
    expect(toastServiceMock.successToastr).toHaveBeenCalled();
  });

  it('should open details dialog', () => {
    component.users = [{ id: '1', email: 'a@test.com' } as any];

    component.onClickMore('1');

    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should load knowledge bases', () => {
    component.ngOnInit();
    expect(knowledgeBaseServiceMock.getKnowledgeBases).toHaveBeenCalled();
  });

  it('should delete knowledge base', () => {
    component.knowledgeBaseArray = [{ id: '1' } as any];

    component.onClickKnowledgeDelete('1');

    expect(knowledgeBaseServiceMock.deleteKnowledgeBase).toHaveBeenCalled();
    expect(toastServiceMock.successToastr).toHaveBeenCalled();
  });
});