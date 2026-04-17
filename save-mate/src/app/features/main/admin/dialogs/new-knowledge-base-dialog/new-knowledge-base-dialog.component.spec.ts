import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewKnowledgeBaseDialogComponent } from './new-knowledge-base-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { KnowledgeBaseService } from 'src/app/core/services/knowledge-base.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of } from 'rxjs';

describe('NewKnowledgeBaseDialogComponent', () => {
  let component: NewKnowledgeBaseDialogComponent;
  let fixture: ComponentFixture<NewKnowledgeBaseDialogComponent>;

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  const knowledgeBaseServiceMock = {
    setKnowledgeBase: jasmine.createSpy().and.returnValue(of({}))
  };

  const toastServiceMock = {
    successToastr: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewKnowledgeBaseDialogComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: KnowledgeBaseService, useValue: knowledgeBaseServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewKnowledgeBaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    dialogRefMock.close.calls.reset();
    knowledgeBaseServiceMock.setKnowledgeBase.calls.reset();
    toastServiceMock.successToastr.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize empty form', () => {
    expect(component.formGroup.get('title')?.value).toBe('');
    expect(component.formGroup.get('text')?.value).toBe('');
    expect(component.formGroup.get('resourceLink')?.value).toBe('');
  });

  it('should close dialog on clickClose', () => {
    component.onClickClose();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should save new knowledge base and call service + toast + close', () => {
    component.formGroup.get('title')?.setValue('title');
    component.formGroup.get('text')?.setValue('text');
    component.formGroup.get('resourceLink')?.setValue('link');

    component.onClickSave();

    expect(knowledgeBaseServiceMock.setKnowledgeBase)
      .toHaveBeenCalled();

    expect(toastServiceMock.successToastr)
      .toHaveBeenCalledWith('Siker', 'Sikeres létrehozás');

    expect(dialogRefMock.close)
      .toHaveBeenCalled();
  });
});