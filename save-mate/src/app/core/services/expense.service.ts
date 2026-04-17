import { Injectable } from '@angular/core';
import { Expense } from '../models/expense';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
private backendLink: string = "http://localhost:3000/expenses";

  constructor(private http: HttpClient) { }

  public getExpense(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getExpensesByUserId(userId: string) {
    return this.http.get(`${this.backendLink}/user/${userId}`);
  }

  public getExpenses() {
    return this.http.get(this.backendLink);
  }

  public updateExpense(id: string, expense: Expense) {
    return this.http.put(`${this.backendLink}/${id}`, expense);
  }

  public deleteExpense(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setExpense(expense: Expense) {
    return this.http.post(this.backendLink, expense);
  }
}
