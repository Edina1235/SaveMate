import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PiggySenseChatComponent } from './piggy-sense-chat.component';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AppUrl } from '../../enums/app-url.enum';

describe('PiggySenseChatComponent', () => {
  let component: PiggySenseChatComponent;
  let fixture: ComponentFixture<PiggySenseChatComponent>;

  let routerEvents$: Subject<any>;
  let routerMock: any;
  let dialogMock: any;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    routerMock = {
      events: routerEvents$
    };

    dialogMock = {
      open: jasmine.createSpy('open')
    };

    await TestBed.configureTestingModule({
      declarations: [PiggySenseChatComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PiggySenseChatComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show chat by default', () => {
    expect(component.showChat).toBeTrue();
  });

  it('should hide chat on hidden route', () => {
    routerEvents$.next(
      new NavigationEnd(1, AppUrl.Questions, AppUrl.Questions)
    );

    expect(component.showChat).toBeFalse();
  });

  it('should show chat on other routes', () => {
    routerEvents$.next(
      new NavigationEnd(1, AppUrl.Home, AppUrl.Home)
    );

    expect(component.showChat).toBeTrue();
  });

  it('should handle router error', () => {
    spyOn(console, 'error');

    routerEvents$.error('router error');

    expect(console.error).toHaveBeenCalledWith('router error');
  });

  it('should open chat dialog on icon click', () => {
    component.onClickIcon();

    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog with correct position', () => {
    component.onClickIcon();

    expect(dialogMock.open).toHaveBeenCalledWith(jasmine.anything(), {
      position: {
        bottom: '0.5rem',
        right: '4rem'
      }
    });
  });
});