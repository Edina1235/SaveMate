import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Income } from '../models/income';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
private backendLink: string = "http://localhost:3000/income";

  constructor(private http: HttpClient) { }

  public getIncome(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getIncomes() {
    return this.http.get(this.backendLink);
  }

  public updateIncome(id: string, income: Income) {
    return this.http.put(`${this.backendLink}/${id}`, income);
  }

  public deleteIncome(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setIncome(income: Income) {
    return this.http.post(this.backendLink, income);
  }
}
