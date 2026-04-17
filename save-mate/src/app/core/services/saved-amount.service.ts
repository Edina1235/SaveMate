import { Injectable } from '@angular/core';
import { SavedAmount } from '../models/saved-amont';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SavedAmountService {
  private backendLink: string = "http://localhost:3000/saved-amount";

  constructor(private http: HttpClient) { }

  public getSavedAmount(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getSavedAmountsByUserId(userId: string) {
    return this.http.get(`${this.backendLink}/user/${userId}`);
  }

  public getSavedAmounts() {
    return this.http.get(this.backendLink);
  }

  public updateSavedAmount(id: string, savedAmount: SavedAmount) {
    return this.http.put(`${this.backendLink}/${id}`, savedAmount);
  }

  public deleteSavedAmount(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setSavedAmount(savedAmount: SavedAmount) {
    return this.http.post(this.backendLink, savedAmount);
  }
}
