import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Message } from './models/message';
import { SenderType } from './enums/sender-type.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent { //TODO: opensource ai használata gpt4all
  @ViewChild('contentElement') contentElement!: ElementRef;
  public formGroup: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required])
  });

  public messages: Message[] = [
    {senderType: SenderType.AI, message: "Jajj cica eszem azt a csöpp kis szád."},
    {senderType: SenderType.User, message: "Nélküed még a mennyország is fáj."},
    {senderType: SenderType.AI, message: "Jajj cica eszem azt a csöpp kis szád."},
    {senderType: SenderType.User, message: "Nélküed még a mennyország is fáj."},
  ];
  public SenderType = SenderType;

  constructor(private dialogRef: MatDialogRef<ChatComponent>) {}

  public onClickSend() {
    this.messages.push({senderType: SenderType.User, message: this.message});
    this.formGroup.get('message')?.setValue('');
    setTimeout(() => {
      this.contentElement.nativeElement.scrollTop = this.contentElement.nativeElement.scrollHeight - this.contentElement.nativeElement.clientHeight;
    });
  }

  private get message() {
    return this.formGroup.get('message')?.value;
  }

  public onClickClose() {
    this.dialogRef.close();
  }
}
