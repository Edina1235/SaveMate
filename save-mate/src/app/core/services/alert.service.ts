import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private backendLink: string = "http://localhost:3000/alerts";
  
  constructor(private http: HttpClient) { }

  public getAlert(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getAlerts() {
    return this.http.get(this.backendLink);
  }

  public updateAlert(id: string, alert: Alert) {
    return this.http.put(`${this.backendLink}/${id}`, alert);
  }

  public deleteAlert(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setAlert(alert: Alert) {
    return this.http.post(this.backendLink, alert);
  }
}
