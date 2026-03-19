import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KnowledgeBase } from '../models/knowledge-base';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeBaseService {
private backendLink: string = "http://localhost:3000/knowledge-base";

  constructor(private http: HttpClient) { }

  public getKnowledgeBase(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getKnowledgeBases() {
    return this.http.get(this.backendLink);
  }

  public updateKnowledgeBase(id: string, knowledgeBase: KnowledgeBase) {
    return this.http.put(`${this.backendLink}/${id}`, knowledgeBase);
  }

  public deleteKnowledgeBase(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setKnowledgeBase(knowledgeBase: KnowledgeBase) {
    return this.http.post(this.backendLink, knowledgeBase);
  }
}
