import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecurringExpense } from '../models/recurring-expense';

@Injectable({
  providedIn: 'root'
})
export class RecurringExpenseService {
private backendLink: string = "http://localhost:3000/recurring-expenses";

  constructor(private http: HttpClient) { }

  public getRecurringExpense(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getRecurringExpenses() {
    return this.http.get(this.backendLink);
  }

  public updateRecurringExpense(id: string, recurringExpense: RecurringExpense) {
    return this.http.put(`${this.backendLink}/${id}`, recurringExpense);
  }

  public deleteRecurringExpense(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setRecurringExpense(recurringExpense: RecurringExpense) {
    return this.http.post(this.backendLink, recurringExpense);
  }
}
