import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';
import { Data } from '../../../Service/data';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { Chatservice } from '../../../Service/chatservice';
import { Socketservice } from '../../../Service/socketservice';
import { jwtDecode } from 'jwt-decode';

// Define interfaces for better type safety
// interface ChatMessage {
//   _id?: string;
//   text?: string;
//   createdAt?: string;
//   sender?: 'user' | 'agent';
//   // Add other message properties as needed
// }

interface ChatPayload {
  msg?: any[];
  name?: any;
  userId?: string;
  user?: { _id: string };
  lastTicket?: { _id: string };
  // Add other payload properties as needed
}

interface SelectedStatus {
  isActive: 'Online' | 'Offline' | 'Waiting';
}

@Component({
  selector: 'app-right',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right.html',
  styleUrl: './right.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Right implements OnChanges, OnInit, OnDestroy {
  @Input() chatSelected: string | null = null; // userId
  @Input() ticket: string | null = null;
  @Output() chatEnded = new EventEmitter<void>();
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  // scroll helpers
  private userAtBottom = true;
  private initialLoadForChat = true;

  userChat: any[] = [];
  ticketId: string | null = null;
  chat: any;

  private adminGetSub?: Subscription;
  private userRoomSub?: Subscription;
  private connectedSub?: Subscription;

  // Track last known message to avoid duplicate updates
  private lastMsgId: string | null = null;
  private lastMsgCount = 0;
finMessage: any[] = [];
  isActive: boolean = false;

  token = localStorage.getItem("token")!;
  userId = localStorage.getItem("userid")!;
  constructor(
    private navService: Data,
    private cd: ChangeDetectorRef,
    private chatService: Socketservice
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    console.log("token");
    this.initSocketListener();

  }
initSocketListener() {
   let tokenData: any = jwtDecode(this.token);
        console.log("tokenData", tokenData);
        this.userId=tokenData.user_id;
    Socketservice.instance.initSocket({
      token: this.token,
      userId: this.userId,
      joinroom: `finexpertchat:user:${this.userId}`,
      eventName: "chat:adminget",


      onData: (data) => {
        console.log("🔥 Angular Chat Updated:", data);

         const msgs = Array.isArray(data.msg) ? data.msg : [];

          const newCount = msgs.length;
          const newLastId = newCount ? msgs[newCount - 1]._id ?? null : null;

          // Avoid re-setting identical data
          if (
            this.userChat.length === newCount &&
            this.lastMsgId &&
            newLastId &&
            this.lastMsgId === newLastId
          ) {
            return;
          }

          if (!this.ticketId) {
            this.ticketId = data.lastTicket?._id ?? null;
          }

          this.userChat = msgs;
          this.lastMsgCount = newCount;
          this.lastMsgId = newLastId;

          // if (log) {
          //   console.log(
          //     '[Right] userChat updated from API, length:',
          //     this.userChat.length
          //   );
          // }

          this.cd.detectChanges();
          this.scrollToBottom(this.initialLoadForChat);
          this.initialLoadForChat = false;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    const token = localStorage.getItem('token');
    console.log("token 2321312");
 this.initSocketListener();
    if (changes['chatSelected']?.currentValue) {
      const userId = this.chatSelected!;
      console.log('[Right] chatSelected changed, userId:', userId);

      // Reset state for new chat
      this.userChat = [];
      this.lastMsgId = null;
      this.lastMsgCount = 0;
      this.initialLoadForChat = true;

      if (this.ticket) {
        this.ticketId = this.ticket;
      }

      // Initial load of history via API ONLY
      this.getUserchatById(userId, true);

      // Join room and listen for updates
      // if (this.chatService.isConnected()) {
      //   this.joinAndSubscribeToUserRoom(userId);
      // }
    }

    if (changes['ticket']?.currentValue !== undefined) {
      this.ticketId = this.ticket;
      console.log('[Right] ticketId changed:', this.ticketId);
    }
  }

  ngOnDestroy(): void {
    if (this.adminGetSub) {
      this.adminGetSub.unsubscribe();
      this.adminGetSub = undefined;
    }
    if (this.userRoomSub) {
      this.userRoomSub.unsubscribe();
      this.userRoomSub = undefined;
    }
    if (this.connectedSub) {
      this.connectedSub.unsubscribe();
      this.connectedSub = undefined;
    }
  }


  endChat(): void {
    this.chatEnded.emit(); // tells parent chat ended
  }


  getUserchatById(id: string, log: boolean = false): void {
    const apiUrl =
      ApiRoutesConstants.BASE_URL +
      ApiRoutesConstants.userchats +
      '/' +
      id +
      '/chats';

    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        if (log) {
          console.log('[Right] API response:', res);
        }

        const data = res?.data;
        if (!data) return;

        if (log) {
          console.log('[Right] datalist', data);
        }

        this.chat = data?.name?.username || data?.name || 'User';

        if (res?.code === 200) {
          const msgs = Array.isArray(data.msg) ? data.msg : [];

          const newCount = msgs.length;
          const newLastId = newCount ? msgs[newCount - 1]._id ?? null : null;

          // Avoid re-setting identical data
          if (
            this.userChat.length === newCount &&
            this.lastMsgId &&
            newLastId &&
            this.lastMsgId === newLastId
          ) {
            return;
          }

          if (!this.ticketId) {
            this.ticketId = data.lastTicket?._id ?? null;
          }

          this.userChat = msgs;
          this.lastMsgCount = newCount;
          this.lastMsgId = newLastId;

          if (log) {
            console.log(
              '[Right] userChat updated from API, length:',
              this.userChat.length
            );
          }

          this.cd.detectChanges();
          this.scrollToBottom(this.initialLoadForChat);
          this.initialLoadForChat = false;
        } else if (log) {
          console.warn('[Right] Unexpected response shape:', res);
        }
      },
      error: (err: any) => {
        if (log) {
          console.error('[Right] Error loading chat:', err);
        }
      }
    });
  }

  agentReply(text: string): void {
    console.log('[Right] agentReply called');

    const message = text.trim();
    if (!message || !this.ticketId || !this.chatSelected) return;

    const apiUrl =
      ApiRoutesConstants.BASE_URL +
      ApiRoutesConstants.AgentReply +
      '/' +
      this.ticketId +
      '/reply';

    const nowIso = new Date().toISOString();

    // Optimistic local message so agent sees it immediately
    const tempMsg: any = {
      _id: 'temp-' + nowIso,
      text: message,
      createdAt: nowIso,
      sender: 'agent'
    };

    this.userChat = [...this.userChat, tempMsg];
    // this.lastMsgId = tempMsg._id;
    this.lastMsgCount = this.userChat.length;
    this.cd.detectChanges();
    this.scrollToBottom(true);

    const body = { text: message };

    this.navService.postData(apiUrl, body).subscribe({
      next: (res: any) => {
        console.log('[Right] Reply Response:', res);
        // Backend will emit chat:adminget again,
        // and socket handler will refresh the full chat.
      },
      error: (err: any) => {
        console.error('[Right] Error sending reply:', err);
      }
    });
  }


  onChatScroll(): void {
    if (!this.chatContainer) return;

    const el = this.chatContainer.nativeElement as HTMLElement;

    const scrollPosition = el.scrollTop + el.clientHeight;
    const scrollHeight = el.scrollHeight;

    const threshold = 60; // px from bottom considered "at bottom"

    this.userAtBottom = scrollHeight - scrollPosition < threshold;
  }

  private scrollToBottom(force: boolean = false): void {
    if (!this.chatContainer) return;

    if (!force && !this.userAtBottom) {
      return;
    }

    setTimeout(() => {
      const el = this.chatContainer?.nativeElement as HTMLElement;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }, 50);
  }
}
