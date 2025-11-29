import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ApiRoutesConstants } from '../constants/api-route-constants';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Socketservice {
  public socketUrl = ApiRoutesConstants.SOCKET_URL;
  private static _instance: Socketservice;
  private socket!: Socket;

  // Add subjects for different events
  private lastMessageSubject = new Subject<any>();
  public lastMessage$ = this.lastMessageSubject.asObservable();
  private typingSubject = new BehaviorSubject<boolean>(false);
  typing$ = this.typingSubject.asObservable();

  static get instance(): Socketservice {
    console.log("socketdata", this._instance);
    if (!this._instance) this._instance = new Socketservice();
    return this._instance;
  }

  initSocket({token, userId, joinroom, eventName, onData}:
    {token: string; userId: string; joinroom: string; eventName: string; onData: (data: any) => void;}) {

    this.socket = io(this.socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      query: { token, userId }
    });

    this.socket.on("connect", () => {
      console.log("Angular Socket Connected:", this.socket.id);

      // existing join
      this.socket.emit("join_room", joinroom);

    });

    // existing dynamic listener
    this.socket.on(eventName, (data: any) => {
      console.log("🔥 Socket Data Received (Angular):", data);
      onData(data);
    });

        this.socket.on('presence:online', (data) => {
      console.log("PRESENCE ONLINE", data);
      if (data.typing !== undefined) {
        this.typingSubject.next(data.typing);
      }
    });

    this.socket.on('presence:offline', (data) => {
      console.log("PRESENCE OFFLINE", data);
      this.typingSubject.next(false);
    });
  
this.socket.on('typing-status', (payload: any) => {
      this.typingSubject.next(payload.isTyping);
    });

  }
  sendTyping(isTyping: boolean,userId: any, ) {
      this.socket.emit("typing", { userId, typing: isTyping });
    }


  emit(eventName: string, payload?: any) {
    if (this.socket) {
      this.socket.emit(eventName, payload);
    }
  }



  // Method to manually trigger last message updates
  public triggerLastMessageUpdate(data: any) {
    this.lastMessageSubject.next(data);
  }

}
