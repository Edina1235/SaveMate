import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { MatDialogRef } from '@angular/material/dialog';
import { AskService } from 'src/app/core/services/ask.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { SenderType } from './enums/sender-type.enum';
import * as markedLib from 'marked';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  let dialogRefMock: any;
  let askServiceMock: any;

  beforeEach(async () => {
    dialogRefMock = {
      close: jasmine.createSpy('close')
    };

    askServiceMock = {
      ask: jasmine.createSpy('ask')
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ChatComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: AskService, useValue: askServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;

    // fake ViewChild
    component.contentElement = {
      nativeElement: {
        scrollTop: 0,
        scrollHeight: 100,
        clientHeight: 50
      }
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default AI message', () => {
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].senderType).toBe(SenderType.AI);
  });

  it('should send message and handle response', fakeAsync(() => {
    component.formGroup.get('message')?.setValue('hello');

    spyOn(markedLib.marked, 'parse').and.returnValue(Promise.resolve('<p>reply</p>'));

    askServiceMock.ask.and.returnValue(
      of({ reply: 'reply' })
    );

    component.onClickSend();

    expect(component.loading).toBeTrue();
    expect(component.messages[1].senderType).toBe(SenderType.User);

    tick(); // async marked

    expect(component.messages.length).toBe(3);
    expect(component.messages[2].senderType).toBe(SenderType.AI);
    expect(component.loading).toBeFalse();
  }));

  it('should clear input after send', () => {
    component.formGroup.get('message')?.setValue('test');

    askServiceMock.ask.and.returnValue(of({ reply: 'ok' }));
    spyOn(markedLib.marked, 'parse').and.returnValue(Promise.resolve('ok'));

    component.onClickSend();

    expect(component.formGroup.get('message')?.value).toBe('');
  });

  it('should scroll after sending message', fakeAsync(() => {
    component.formGroup.get('message')?.setValue('hello');

    askServiceMock.ask.and.returnValue(of({ reply: 'ok' }));
    spyOn(markedLib.marked, 'parse').and.returnValue(Promise.resolve('ok'));

    component.onClickSend();

    tick(); // setTimeout

    expect(component.contentElement.nativeElement.scrollTop).toBe(
      component.contentElement.nativeElement.scrollHeight -
      component.contentElement.nativeElement.clientHeight
    );
  }));

  it('should handle error from askService', () => {
    spyOn(console, 'error');

    component.formGroup.get('message')?.setValue('hello');

    askServiceMock.ask.and.returnValue(
      throwError(() => new Error('error'))
    );

    component.onClickSend();

    expect(console.error).toHaveBeenCalled();
  });

  it('should close dialog on close click', () => {
    component.onClickClose();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});