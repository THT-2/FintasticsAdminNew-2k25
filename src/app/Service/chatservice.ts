import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {
  BehaviorSubject,
  Observable,
  fromEvent as rxFromEvent,
  Subject,
  Subscription
} from 'rxjs';
import { ApiRoutesConstants } from '../constants/api-route-constants';

@Injectable({ providedIn: 'root' })
export class Chatservice {
  public socketUrl = ApiRoutesConstants.SOCKET_URL;

  private socket: Socket | null = null;

  // Connection status
  private connectedSubject = new BehaviorSubject<boolean>(false);
  connected$ = this.connectedSubject.asObservable();

  // Currently active chat (for left/right sync if needed)
  private activeChat = new BehaviorSubject<any>(null);
  activeChat$ = this.activeChat.asObservable();

  // Last message info (for chat list preview)
  private lastMsgSubject = new Subject<{
    userId: string;
    text: string;
    createdAt: string;
  }>();
  lastMsg$ = this.lastMsgSubject.asObservable();

  // Track active rooms for reconnection
  private activeRooms: Set<string> = new Set();

  constructor() {
    console.log('[ChatService] Initializing chat service');
    this.tryConnect();
  }


  // ---------- PUBLIC HELPERS ----------

  updateLastMsg(userId: string, text: string, createdAt: string) {
    console.log('[ChatService] Updating last message for user:', userId, text);
    this.lastMsgSubject.next({ userId, text, createdAt });
  }

  get isConnected(): boolean {
    return this.connectedSubject.value;
  }

  setActiveChat(chat: any) {
    this.activeChat.next(chat);
  }

  // Call this AFTER login, once token is stored in localStorage
  tryConnect() {
    const token = localStorage.getItem('token');
    console.log('[ChatService] Attempting connection with token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.warn('[ChatService] No token found in localStorage. Socket will NOT connect yet.');
      return;
    }

    // Avoid multiple connections
    if (this.socket && this.socket.connected) {
      console.log('[ChatService] Already connected, skipping new connection.');
      return;
    }

    // If there is an existing socket but disconnected, clean it up
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket = null;
    }

    console.log('[ChatService] Creating new socket connection to:', this.socketUrl);
    this.socket = io(this.socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: { token },
      query: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[ChatService] ✅ Socket connected with id:', this.socket?.id);
      this.connectedSubject.next(true);

      // Re-join all active rooms after reconnection
      this.rejoinActiveRooms();
    });

    this.socket.on('connect_error', (err) => {
      console.error('[ChatService] ❌ Connect error:', err);
      this.connectedSubject.next(false);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[ChatService] 🔌 Disconnected:', reason);
      this.connectedSubject.next(false);
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log('[ChatService] 🔄 Reconnection attempt:', attempt);
    });

    this.socket.on('reconnect_error', (err) => {
      console.error('[ChatService] ❌ Reconnect error:', err);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[ChatService] ❌ Reconnect failed');
    });

    // Log all incoming events for debugging
    this.socket.onAny((event, data) => {
      console.log(`[ChatService] 📨 Event received: ${event}`, data);
    });
  }

  private rejoinActiveRooms(): void {
    console.log('[ChatService] Rejoining active rooms:', Array.from(this.activeRooms));
    this.activeRooms.forEach(room => {
      this.joinRoom(room);
    });
  }

  // Generic emit
  emit(event: string, payload?: any) {
    if (!this.socket) {
      console.warn('[ChatService] emit called but socket is not set. Event:', event);
      return;
    }
    console.log('[ChatService] 📤 Emitting:', event, payload);
    this.socket.emit(event, payload);
  }

  // Generic fromEvent wrapper (RxJS Observable)
  fromEvent<T = any>(event: string): Observable<T> {
    if (!this.socket) {
      console.warn('[ChatService] fromEvent called but socket is not set. Event:', event);
      return new Observable<T>();
    }
    return rxFromEvent<T>(this.socket as any, event as any);
  }

  // Join a room
  joinRoom(room: string) {
    if (!this.socket) {
      console.warn('[ChatService] joinRoom called but socket is not set. Room:', room);
      return;
    }
    console.log('[ChatService] 🚪 Joining room:', room);
    this.socket.emit('joinRoom', { room });
    this.activeRooms.add(room);
  }

  leaveRoom(room: string) {
    if (!this.socket) {
      console.warn('[ChatService] leaveRoom called but socket is not set. Room:', room);
      return;
    }
    console.log('[ChatService] 🚪 Leaving room:', room);
    this.socket.emit('leaveRoom', { room });
    this.activeRooms.delete(room);
  }

  // Listen to specific user room events
  listenToUserRoom(userId: string): Observable<any> {
    const roomEvent = `finexpertchat:user:${userId}`;
    console.log('[ChatService] Setting up listener for room event:', roomEvent);
    return this.fromEvent<any>(roomEvent);
  }

  // Listen to global admin events
  listenToAdminGet(): Observable<any> {
    console.log('[ChatService] Setting up listener for global chat:adminget');
    return this.fromEvent<any>('chat:adminget');
  }

  // Listen to user last message events
  listenToUserLastMsg(): Observable<any> {
    return this.fromEvent<any>('chat:userlastMsg');
  }
  
  // Add to Chatservice class
listenToUserChatGet(): Observable<any> {
  console.log('[ChatService] Setting up listener for userchatget');
  return this.fromEvent<any>('userchatget');
}

listenToAdminGetList(): Observable<any> {
  console.log('[ChatService] Setting up listener for admingetlist');
  return this.fromEvent<any>('admingetlist');
}

listenToChatCreate(): Observable<any> {
  console.log('[ChatService] Setting up listener for chatCreate');
  return this.fromEvent<any>('chatCreate');
}

  // Debug method to see all active listeners
  debugSocketListeners() {
    if (!this.socket) {
      console.log('[ChatService] No socket instance available');
      return;
    }
    // console.log('[ChatService] Active socket listeners:', this.socket.eventNames());
    console.log('[ChatService] Active rooms:', Array.from(this.activeRooms));
    console.log('[ChatService] Connection state:', this.socket.connected ? 'Connected' : 'Disconnected');
  }

  disconnect() {
    if (!this.socket) return;
    console.log('[ChatService] Manual disconnect called');
    this.socket.disconnect();
    this.socket.removeAllListeners();
    this.socket = null;
    this.activeRooms.clear();
    this.connectedSubject.next(false);
  }
}
