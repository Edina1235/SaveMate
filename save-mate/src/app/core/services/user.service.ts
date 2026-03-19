import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendLink: string = "http://localhost:3000/users";

  constructor(private http: HttpClient) { }

  public getUser(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getUsers() {
    return this.http.get(this.backendLink);
  }

  public updateUser(id: string, user: User) {
    return this.http.put(`${this.backendLink}/${id}`, user);
  }

  public deleteUser(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setUser(user: User) {
    return this.http.post(this.backendLink, user);
  }
}
