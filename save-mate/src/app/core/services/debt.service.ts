import { Injectable } from '@angular/core';
import { Debt } from '../models/debt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
private backendLink: string = "http://localhost:3000/debts";

  constructor(private http: HttpClient) { }

  public getDebt(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getDebtsByUserId(userId: string) {
    return this.http.get(`${this.backendLink}/user/${userId}`);
  }

  public getDebts() {
    return this.http.get(this.backendLink);
  }

  public updateDebt(id: string, debt: Debt) {
    return this.http.put(`${this.backendLink}/${id}`, debt);
  }

  public deleteDebt(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setDebt(debt: Debt) {
    return this.http.post(this.backendLink, debt);
  }
}
