import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactMessageService } from 'src/app/core/services/contact-message.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  const contactServiceMock = {
    setContactMessage: jasmine.createSpy().and.returnValue(of({}))
  };

  const toastServiceMock = {
    successToastr: jasmine.createSpy()
  };

  const afAuthMock = {
    user: of({ uid: '123' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactComponent],
      imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, NoopAnimationsModule],
      providers: [
        { provide: ContactMessageService, useValue: contactServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: AngularFireAuth, useValue: afAuthMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    contactServiceMock.setContactMessage.calls.reset();
    toastServiceMock.successToastr.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selected category', () => {
    component.onClickCategory('test' as any);

    expect(component.selectedCategory).toBe('test' as any);
  });

  it('should send contact message', () => {
    component.formGroup.get('category')?.setValue('cat');
    component.formGroup.get('message')?.setValue('hello');

    component.onClickSend();

    expect(contactServiceMock.setContactMessage).toHaveBeenCalled();
    expect(toastServiceMock.successToastr).toHaveBeenCalledWith(
      'Siker',
      'Üzenet sikeresen elküldve!'
    );
  });
});