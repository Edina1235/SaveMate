import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Goal } from '../models/goal';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
private backendLink: string = "http://localhost:3000/goals";

  constructor(private http: HttpClient) { }

  public getGoal(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getGoalsByUserId(userId: string) {
    return this.http.get(`${this.backendLink}/user/${userId}`);
  }

  public getGoals() {
    return this.http.get(this.backendLink);
  }

  public updateGoal(id: string, goal: Goal) {
    return this.http.put(`${this.backendLink}/${id}`, goal);
  }

  public deleteGoal(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setGoal(goal: Goal) {
    return this.http.post(this.backendLink, goal);
  }
}
