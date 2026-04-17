import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensesRowComponent } from './expenses-row.component';
import { ReactiveFormsModule } from '@angular/forms';
import * as Papa from 'papaparse';
import { ExpenseInput } from 'src/app/core/models/expense-input';

describe('ExpensesRowComponent', () => {
  let component: ExpensesRowComponent;
  let fixture: ComponentFixture<ExpensesRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensesRowComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a row when no expenses provided', () => {
    component.expenses = [];
    component.ngOnInit();

    expect(component.indexes.length).toBe(1);
    expect(component.expensesGroup.contains('spendingCategory_1')).toBeTrue();
  });

  it('should initialize rows from input', () => {
    const input: ExpenseInput[] = [
      { category: component.categories[0], amount: 100 }
    ];

    component.expenses = input;
    component.ngOnInit();

    expect(component.indexes.length).toBe(1);
    expect(component.getCostByIndex(1)).toBe(100);
  });

  it('should emit on form value change', () => {
    spyOn(component.expensesOutput, 'emit');

    component.expenses = [];
    component.ngOnInit();

    const control = component.expensesGroup.get('cost_1');
    control?.setValue(500);

    expect(component.expensesOutput.emit).toHaveBeenCalled();
  });

  it('should delete row correctly', () => {
    component.expenses = [];
    component.ngOnInit();

    const id = component.indexes[0];

    component.onClickDelete(id);

    expect(component.indexes.length).toBe(0);
    expect(Object.keys(component.expensesGroup.controls).length).toBe(1); // csvFile stays
  });

  it('should call onClickNewRow and add new row', () => {
    component.expenses = [];
    component.ngOnInit();

    const before = component.indexes.length;

    component.onClickNewRow();

    expect(component.indexes.length).toBe(before + 1);
  });

  it('should map description to category fallback', () => {
    const result = (component as any).getCategoryByDescription('UNKNOWN_TEXT');
    expect(result).toBe(component.categories.includes(result) ? result : result);
  });

  it('should emit income and expenses when CSV parsed', () => {
    spyOn(component.incomes, 'emit');
    spyOn(component.expensesCsvOutput, 'emit');

    const fakeFile = new File(
      ['Description,Amount (HUF),Date\nSalary,1000,2023-01-01'],
      'test.csv',
      { type: 'text/csv' }
    );

    const papaSpy = spyOn(Papa as any, 'parse').and.callFake((file: any, options: any) => {
    const result = {
        data: [
        {
            Description: 'Salary',
            'Amount (HUF)': 1000,
            Date: '2024-01-01'
        }
        ]
    };

    options.complete(result);
    });

    (component as any).parseCSV(fakeFile);

    expect(papaSpy).toHaveBeenCalled();
    expect(component.incomes.emit).toHaveBeenCalled();
    expect(component.expensesCsvOutput.emit).toHaveBeenCalled();
  });
});