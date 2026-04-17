import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Message } from './models/message';
import { SenderType } from './enums/sender-type.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AskService } from 'src/app/core/services/ask.service';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @ViewChild('contentElement') contentElement!: ElementRef;
  public formGroup: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required])
  });
  public loading: boolean = false;

  public messages: Message[] = [{senderType: SenderType.AI, message: "Miben segíthetek neked?"}];
  public SenderType = SenderType;

  constructor(private dialogRef: MatDialogRef<ChatComponent>,
              private askService: AskService
  ) {}

  public onClickSend() {
    this.messages.push({senderType: SenderType.User, message: this.message});
    this.loading = true;
    this.askService.ask(this.message).subscribe({next: async message => {
      const reply: string = message.reply;
      const parsedReply = await marked.parse(reply);
      this.messages.push({senderType: SenderType.AI, message: DOMPurify.sanitize(parsedReply)});
      this.loading = false;
    }, error: error => console.error(error)});
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
