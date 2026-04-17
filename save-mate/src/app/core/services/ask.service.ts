import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AskService {
  private backendLink: string = "http://localhost:3000/ask";

  constructor(private http: HttpClient) { }

  public ask(question: string) {
    return this.http.post<{reply: string}>(this.backendLink, {question: question});
  }
}
