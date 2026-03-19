import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactMessage } from '../models/contact-message';

@Injectable({
  providedIn: 'root'
})
export class ContactMessageService {
private backendLink: string = "http://localhost:3000/contact-messages";

  constructor(private http: HttpClient) { }

  public getContactMessage(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getContactMessages() {
    return this.http.get(this.backendLink);
  }

  public updateContactMessage(id: string, contactMessage: ContactMessage) {
    return this.http.put(`${this.backendLink}/${id}`, contactMessage);
  }

  public deleteContactMessage(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setContactMessage(contactMessage: ContactMessage) {
    return this.http.post(this.backendLink, contactMessage);
  }
}
