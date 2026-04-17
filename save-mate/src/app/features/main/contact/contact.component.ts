import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactCategory } from 'src/app/core/enums/contact-category.enum';
import { ContactMessage } from 'src/app/core/models/contact-message';
import { ContactMessageService } from 'src/app/core/services/contact-message.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  public contactCategories: ContactCategory[] = Object.values(ContactCategory);
  public selectedCategory?: ContactCategory;

  public formGroup: FormGroup = new FormGroup({
    category: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  });

  constructor(private contactMessageService: ContactMessageService,
              private afAuth: AngularFireAuth,
              private toastService: ToastService) {}

  public onClickCategory(category: ContactCategory) {
    this.selectedCategory = category;
  }

  public onClickSend() {
    this.afAuth.user.subscribe({next: user => {
      const userId = user!.uid;
      
      const contactMessage: ContactMessage = {
        id: "",
        category: this.formGroup.get("category")?.value,
        message: this.formGroup.get("message")?.value,
        userId: userId,
        date: new Date()
      };
      this.contactMessageService.setContactMessage(contactMessage).subscribe({next: () => {
        this.toastService.successToastr("Siker", "Üzenet sikeresen elküldve!");
        this.formGroup.reset();
        this.selectedCategory = undefined;
      }, error: error => console.error(error)});
    }, error: error => console.error(error)});
  }
}
