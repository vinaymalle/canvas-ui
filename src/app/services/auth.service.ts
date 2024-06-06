import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../src/config'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(body: any) {
    return this.http.post(`${API_URL}auth/login`, body);
  }

  register(body: any) {
    return this.http.post(`${API_URL}auth/register`, body);
  }
}
