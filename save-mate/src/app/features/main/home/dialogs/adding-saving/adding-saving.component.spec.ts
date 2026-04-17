import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddingSavingComponent } from './adding-saving.component';
import { MatDialogRef } from '@angular/material/dialog';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

describe('AddingSavingComponent', () => {
  let component: AddingSavingComponent;
  let fixture: ComponentFixture<AddingSavingComponent>;
  let authMock: { authState: any; currentUser: Promise<any>; signInWithEmailAndPassword: jasmine.Spy };

  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddingSavingComponent>>;
  let savedAmountServiceSpy: jasmine.SpyObj<SavedAmountService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    savedAmountServiceSpy = jasmine.createSpyObj('SavedAmountService', ['setSavedAmount']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['successToastr']);

    authMock = {
      authState: of(null),
      currentUser: Promise.resolve({ uid: 'test-user' }),
      signInWithEmailAndPassword: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      declarations: [AddingSavingComponent],
      providers: [
        { provide: AngularFireAuth, useValue: authMock },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: SavedAmountService, useValue: savedAmountServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddingSavingComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    savedAmountServiceSpy.setSavedAmount.and.returnValue(of({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on close click', () => {
    component.onClickClose();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should return savedAmount from form', () => {
    component.savedAmountGroup.setValue({ savedAmount: '123' });
    expect(component.savedAmount).toBe('123');
  });

  it('should call service and show toast on save', async () => {

    component.savedAmountGroup.setValue({ savedAmount: '200' });

    await component.onClickSave();

    expect(savedAmountServiceSpy.setSavedAmount).toHaveBeenCalled();

    expect(toastServiceSpy.successToastr).toHaveBeenCalledWith(
      'Siker',
      'Sikeres mentés'
    );

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should handle missing userId safely', async () => {

    authMock.currentUser = Promise.resolve(null);
    component.savedAmountGroup.setValue({ savedAmount: '100' });

    await component.onClickSave();

    expect(savedAmountServiceSpy.setSavedAmount).toHaveBeenCalledWith(
      jasmine.objectContaining({
        userId: ''
      })
    );
  });
});