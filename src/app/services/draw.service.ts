import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../src/config'
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class DrawService {

  socket!: Socket;

  constructor(private http: HttpClient) { }

  createConnection() {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(API_URL, { transports: ['websocket', 'pulling', 'flashsocket'] });
    }
  }

  closeConnection() {
    if (this.socket && this.socket.connected) {
      this.socket.close();
    }
  }

  getData(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('data', (data) => {
        observer.next(data);
      })
    })
  }

  getColor(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('color', (data) => {
        observer.next(data);
      })
    })
  }

  newData(data: any) {
    this.socket.emit('new-data', data);
  }

  changeColor(color: string){
    this.socket.emit('change-color', color);
  }

  saveDrawing(data: any): Observable<any> {
    return this.http.post(`${API_URL}draw`, data);
  }

  getDrawing(): Observable<any> {
    return this.http.get(`${API_URL}draw`);
  }
}
