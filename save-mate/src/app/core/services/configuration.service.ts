import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from '../models/configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
private backendLink: string = "http://localhost:3000/configuration";

  constructor(private http: HttpClient) { }

  public getConfiguration(id: string) {
    return this.http.get(`${this.backendLink}/${id}`);
  }

  public getConfigurations() {
    return this.http.get(this.backendLink);
  }

  public updateConfiguration(id: string, configuration: Configuration) {
    return this.http.put(`${this.backendLink}/${id}`, configuration);
  }

  public deleteConfiguration(id: string) {
    return this.http.delete(`${this.backendLink}/${id}`);
  }

  public setConfiguration(configuration: Configuration) {
    return this.http.post(this.backendLink, configuration);
  }
}
