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

  private lastMessageSubject = new Subject<any>();
  public lastMessage$ = this.lastMessageSubject.asObservable();
  private typingSubject = new BehaviorSubject<boolean>(false);
  public typing$ = this.typingSubject.asObservable();

  private currentUserId: any;   // <-- store userId so we know who is typing

  static get instance(): Socketservice {
    if (!this._instance) this._instance = new Socketservice();
    return this._instance;
  }

  initSocket({
    token,
    userId,
    joinroom,
    eventName,
    onData
  }: {
    token: string;
    userId: string;
    joinroom: string;
    eventName: string;
    onData: (data: any) => void;
  }) {

    this.currentUserId = userId; // <---- save for later comparison

    this.socket = io(this.socketUrl, {
      transports: ['websocket'],
      query: { token, userId }
    });

    this.socket.on("connect", () => {
  console.log("Angular Socket Connected:", this.socket.id);
  this.socket.emit("join", joinroom);   // ✅ must be "join"
});


    // main data listener
    this.socket.on(eventName, (data: any) => {
      onData(data);
    });

    // 🔥🔥 LISTEN FOR TYPING FROM SERVER USING YOUR EXACT BACKEND EVENT
    this.socket.on("chat:typing", (payload: any) => {
      console.log("📩 chat:typing received", payload);

      if (!payload) return;

      // ❌ Ignore my own typing event
      if (String(payload.userId) === String(this.currentUserId)) {
        return;
      }

      // ✔ Show other user typing
      this.typingSubject.next(payload.isTyping === true);
    });
  }

  // 🔥🔥 EMIT TYPING EXACTLY AS BACKEND EXPECTS
  sendTyping(isTyping: boolean) {
    if (!this.socket) return;

    console.log("📤 sending chat:typing", { isTyping });

    this.socket.emit("chat:typing", {
      isTyping: isTyping
    });
  }

  emit(eventName: string, payload?: any) {
    this.socket?.emit(eventName, payload);
  }

  public triggerLastMessageUpdate(data: any) {
    this.lastMessageSubject.next(data);
  }
}
