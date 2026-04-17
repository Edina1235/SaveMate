import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtRowsComponent } from './debt-rows.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DebtInput } from 'src/app/core/models/debt-input';

describe('DebtRowsComponent', () => {
  let component: DebtRowsComponent;
  let fixture: ComponentFixture<DebtRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebtRowsComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DebtRowsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create one empty row when debtsInput is empty', () => {
    component.debtsInput = [];

    component.ngOnInit();

    expect(component.indexes.length).toBe(1);
    expect(component.debtsGroup.contains('name_1')).toBeTrue();
  });

  it('should initialize rows with input data', () => {
    const input: DebtInput[] = [
      {
        name: 'Loan',
        totalAmount: 1000,
        monthlyPayment: 100,
        paidAmount: 200,
        interest: 5
      }
    ];

    component.debtsInput = input;

    component.ngOnInit();

    expect(component.indexes.length).toBe(1);
    expect(component.getNameByIndex(1)).toBe('Loan');
  });

  it('should emit validGroup on init when form is valid', () => {
    spyOn(component.validGroup, 'emit');

    const input: DebtInput[] = [
      {
        name: 'Loan',
        totalAmount: 1000,
        monthlyPayment: 100,
        paidAmount: 200,
        interest: 5
      }
    ];

    component.debtsInput = input;

    component.ngOnInit();

    expect(component.validGroup.emit).toHaveBeenCalled();
  });

  it('should add new row when clicking new row button', () => {
    component.debtsInput = [];
    component.ngOnInit();

    const initialLength = component.indexes.length;

    component.onClickNewRow();

    expect(component.indexes.length).toBe(initialLength + 1);
  });

  it('should delete row correctly', () => {
    component.debtsInput = [];
    component.ngOnInit();

    const id = component.indexes[0];

    component.onClickDelete(id);

    expect(component.indexes.length).toBe(0);
  });

  it('should emit debtDataChange when form changes', () => {
    spyOn(component.debtDataChange, 'emit');

    component.debtsInput = [];
    component.ngOnInit();

    const control = component.debtsGroup.get('name_1');
    control?.setValue('Test');

    expect(component.debtDataChange.emit).toHaveBeenCalled();
  });

  it('should calculate totals correctly', () => {
    component.debtsInput = [
      {
        name: 'A',
        totalAmount: 100,
        monthlyPayment: 50,
        paidAmount: 20,
        interest: 5
      },
      {
        name: 'B',
        totalAmount: 200,
        monthlyPayment: 70,
        paidAmount: 30,
        interest: 10
      }
    ];

    component.ngOnInit();

    expect(component.totalAmount).toBe(300);
    expect(component.monthlyAmount).toBe(120);
  });
});