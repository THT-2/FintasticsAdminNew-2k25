import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from'rxjs';
import { ApiRoutesConstants } from '../constants/api-route-constants';

@Injectable({
  providedIn: 'root'
})
export class Socketservice {
   public socketUrl = ApiRoutesConstants.SOCKET_URL;
private static _instance: Socketservice;
  private socket!: Socket;

  static get instance(): Socketservice {
    console.log("socketdata",this._instance);

    if (!this._instance) this._instance = new Socketservice();
    return this._instance;
  }

  initSocket({token, userId,joinroom,eventName,onData}:
     {token: string;userId: string;joinroom: string;eventName: string;onData: (data: any) => void;}) {

    this.socket = io(this.socketUrl, {
      transports: ['websocket','polling'],
      autoConnect: true,
      reconnection: true,
      query: { token, userId }
    });

    this.socket.on("connect", () => {
      console.log("Angular Socket Connected:", this.socket.id);

      // Join same room as Flutter
      this.socket.emit("join_room", joinroom);
    });
    this.socket.on(eventName, (data: any) => {
      console.log("🔥 Socket Data Received (Angular):", data);
      onData(data);
    });
    // Listen to your eventName (chat:get)
  }

  emit(eventName: string, payload?: any) {
    if (this.socket) {
      this.socket.emit(eventName, payload);
    }
  }


}
