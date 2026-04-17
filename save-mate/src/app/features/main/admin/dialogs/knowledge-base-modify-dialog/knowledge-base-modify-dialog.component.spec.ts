import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnowledgeBaseModifyDialogComponent } from './knowledge-base-modify-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { KnowledgeBaseService } from 'src/app/core/services/knowledge-base.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of } from 'rxjs';

describe('KnowledgeBaseModifyDialogComponent', () => {
  let component: KnowledgeBaseModifyDialogComponent;
  let fixture: ComponentFixture<KnowledgeBaseModifyDialogComponent>;

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  const knowledgeBaseServiceMock = {
    updateKnowledgeBase: jasmine.createSpy().and.returnValue(of({}))
  };

  const toastServiceMock = {
    successToastr: jasmine.createSpy()
  };

  const mockData = {
    id: '1',
    title: 'old title',
    text: 'old text',
    resourceLink: 'link'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeBaseModifyDialogComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: KnowledgeBaseService, useValue: knowledgeBaseServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeBaseModifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    dialogRefMock.close.calls.reset();
    knowledgeBaseServiceMock.updateKnowledgeBase.calls.reset();
    toastServiceMock.successToastr.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form values on init', () => {
    expect(component.formGroup.get('title')?.value).toBe('old title');
    expect(component.formGroup.get('text')?.value).toBe('old text');
    expect(component.formGroup.get('resourceLink')?.value).toBe('link');
  });

  it('should close dialog on close click', () => {
    component.onClickClose();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should save knowledge base and call service + toast + close', () => {
    component.formGroup.get('title')?.setValue('new title');
    component.formGroup.get('text')?.setValue('new text');
    component.formGroup.get('resourceLink')?.setValue('new link');

    component.onClickSave();

    expect(knowledgeBaseServiceMock.updateKnowledgeBase)
      .toHaveBeenCalled();

    expect(toastServiceMock.successToastr)
      .toHaveBeenCalledWith('Siker', 'Sikeres módosítás');

    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});