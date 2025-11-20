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

interface selectedStatus {
  isActive: "Online" | "Offline" | "Waiting";
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
  private userAtBottom = true; // is user currently near bottom?
  private initialLoadForChat = true;

  userChat: any[] = [];
  items: any;
  ticketId: string | null = null;
  chatName: any;


  private roomName?: string;
  private adminGetSub?: Subscription;
  private connectedSub?: Subscription;

  // Track last known message to avoid duplicate updates
  private lastMsgId: string | null = null;
  private lastMsgCount = 0;

  constructor(
    private navService: Data,
    private cd: ChangeDetectorRef,
    private chatService: Chatservice
  ) {}

 // In Right component - Replace the current subscription
ngOnInit(): void {
  console.log('[Right] ngOnInit');

  // Subscribe to room-specific events when chat is selected
  this.setupRoomSubscription();

  // When socket connects/reconnects, re-setup subscription
  this.connectedSub = this.chatService.connected$
    .pipe(filter((isConnected) => isConnected))
    .subscribe(() => {
      console.log('[Right] Socket connected$ => true');
      if (this.roomName) {
        console.log('[Right] (Re)joining room after connection:', this.roomName);
        this.chatService.joinRoom(this.roomName);
        this.setupRoomSubscription(); // Resubscribe on reconnect

        const userId = this.chatSelected;
        if (userId) {
          this.getUserchatById(userId, true);
        }
      }
    });
}

private setupRoomSubscription(): void {
  // Clean up previous subscription
  if (this.adminGetSub) {
    this.adminGetSub.unsubscribe();
  }

  if (this.chatSelected) {
    // Listen to room-specific events
    this.adminGetSub = this.chatService
      .listenToUserRoom(this.chatSelected)
      .subscribe((payload) => {
        console.log('[Right] Room-specific event payload:', payload);
        this.handleIncomingPayload(payload);
      });
  }
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['chatSelected']?.currentValue) {
    const userId = this.chatSelected!;
    console.log('[Right] chatSelected changed, userId:', userId);

    // Leave previous room if there was one
    if (this.roomName) {
      console.log('[Right] Leaving previous room:', this.roomName);
      this.chatService.leaveRoom(this.roomName);
    }

    // Room name must match backend room
    this.roomName = `finexpertchat:user:${userId}`;
    console.log('[Right] New roomName:', this.roomName);

    // Reset tracking
    this.lastMsgId = null;
    this.lastMsgCount = 0;
    this.userChat = [];
    this.ticketId = this.ticket ?? null;

    this.initialLoadForChat = true;
    this.userAtBottom = true;

    // Setup room subscription FIRST
    this.setupRoomSubscription();

    if (this.chatService.isConnected) {
      this.chatService.joinRoom(this.roomName);
    } else {
      console.log(
        '[Right] Socket not connected yet; will join when connected$ emits'
      );
    }
    // Initial load via REST
    this.getUserchatById(userId, true);
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
    if (this.connectedSub) {
      this.connectedSub.unsubscribe();
      this.connectedSub = undefined;
    }
    if (this.roomName) {
      this.chatService.leaveRoom(this.roomName);
    }
  }

  // ------------- SOCKET: FULL PAYLOAD -------------


  private handleIncomingPayload(payload: any) {
    try {
      const msgs = Array.isArray(payload?.msg) ? payload.msg : [];
      if (!msgs.length) return;

      const newLast = msgs[msgs.length - 1];
      const newLastId = newLast?._id ?? null;
      const newCount = msgs.length;

      // Ignore duplicate broadcasts
      if (
        this.lastMsgCount === newCount &&
        this.lastMsgId &&
        newLastId &&
        this.lastMsgId === newLastId
      ) {
        return;
      }

      this.lastMsgCount = newCount;
      this.lastMsgId = newLastId;

      if (payload?.name) {
        this.chatName = payload.name;
      }
      if (!this.ticketId && payload?.lastTicket?._id) {
        this.ticketId = payload.lastTicket._id;
      }

      this.userChat = msgs;
      console.log('[Right] userChat updated from socket, length:', this.userChat.length);

      // Tell Left about the new last message
      if (this.chatSelected && newLast) {
        this.chatService.updateLastMsg(
          this.chatSelected,
          newLast.text || '',
          newLast.createdAt || new Date().toISOString()
        );
      }

      this.cd.detectChanges();
      this.scrollToBottom(false);
    } catch (err) {
      console.error('[Right] Error handling incoming payload:', err);
    }
  }

  // ------------- UI ACTIONS -------------

  endChat() {
    this.chatEnded.emit(); // tells parent chat ended
  }

  // ------------- API: HISTORY -------------

  getUserchatById(id: string, log: boolean = false) {
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

        this.chatName = data?.name?.username || data?.name || 'User';

        if (res?.code === 200) {
          const msgs = Array.isArray(data.msg) ? data.msg : [];

          const newCount = msgs.length;
          const newLastId = newCount ? msgs[newCount - 1]._id ?? null : null;

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
            console.log('[Right] userChat updated from API, length:', this.userChat.length);
          }

          if (newCount && this.chatSelected) {
            const lastMsgObj = msgs[newCount - 1];
            const lastText = lastMsgObj?.text || '';
            const lastCreated = lastMsgObj?.createdAt || new Date().toISOString();

            this.chatService.updateLastMsg(
              this.chatSelected,
              lastText,
              lastCreated
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

  // ------------- API: STATUS -------------



  // ------------- API: AGENT REPLY (with optimistic update) -------------

  agentReply(text: string) {
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

    const tempMsg = {
      _id: 'temp-' + nowIso,
      text: message,
      createdAt: nowIso,
      sender: 'agent'
    };

    this.userChat = [...this.userChat, tempMsg];
    this.lastMsgId = tempMsg._id;
    this.lastMsgCount = this.userChat.length;
    this.cd.detectChanges();
    this.scrollToBottom(true);

    this.chatService.updateLastMsg(
      this.chatSelected,
      message,
      nowIso
    );

    const body = { text: message };

    this.navService.postData(apiUrl, body).subscribe({
      next: (res: any) => {
        console.log('[Right] Reply Response:', res);
        // backend will emit chat:adminget again
      },
      error: (err: any) => {
        console.error('[Right] Error sending reply:', err);
      }
    });
  }

  // ------------- SCROLL HELPERS -------------

  onChatScroll() {
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
