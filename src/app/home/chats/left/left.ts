// Updated Left.ts with socket-based last message integration
// (Full working code as requested)

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { Data } from '../../../Service/data';
import { CommonModule } from '@angular/common';
import { Socketservice } from '../../../Service/socketservice';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';
import { log } from 'node:console';

type StatusValue = 'Online' | 'Offline' | 'Waiting';

interface SelectedStatus {
  isActive: StatusValue;
}

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left.html',
  styleUrl: './left.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [AlertService]
})
export class Left implements OnInit, AfterViewInit, OnDestroy {
  public apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.agentchatlist;

  chatList: any[] = [];
  selectedChat: any = null;
  selectedStatus: StatusValue = 'Online';
  currentTicketId: string | null = null;
  selectedticketId:any

  @Output() chatSelected = new EventEmitter<string>();
  @Output() ticket = new EventEmitter<string>();
  @Output() openChat = new EventEmitter<void>();

  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;

  private token = localStorage.getItem('token')!;
  private userId = localStorage.getItem('userid')!;
  private lastMessageSubscription!: Subscription;
  private socketInitialized = false;

  constructor(
    private navService: Data,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private socketService: Socketservice
  ) {}

  ngOnInit(): void {
    let tokenData: any;
    try {
      tokenData = jwtDecode(this.token);
      this.userId = tokenData.user_id;
      console.log("tokuserid",this.userId);

    } catch (error) {
      console.error('Error decoding token:', error);
    }

    this.getchatList();
    this.initSocketListener();
    this.subscribeToLastMessages();
  }

initSocketListener() {
  if (this.socketInitialized) return;

  Socketservice.instance.initSocket({
    token: this.token,
    userId: this.userId,
    joinroom: `finexpertchat:user:${this.userId}`,
    eventName: 'chat:userlastMsg',
    onData: (data) => {
      console.log("socketid",data);

      this.handleLastMessageUpdate(data);
    }
  });

  this.socketInitialized = true;
}

  subscribeToLastMessages() {
    this.lastMessageSubscription = this.socketService.lastMessage$.subscribe(
      (data: any) => {
        console.log('🔥 Left - Last Message Update Received:', data);
        this.handleLastMessageUpdate(data);
      }
    );
  }

  getchatList() {
    this.chatList = [];
    this.navService.getData(this.apiUrl).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          this.chatList = res.data;
          console.log("Left data",this.chatList);

          this.cdr.detectChanges();
        } else {
          this.alertService.toast('error', true, res.message);
        }
      },
      error: (error: any) => {
        this.alertService.toast('error', true, error);
      }
    });
  }

 private handleLastMessageUpdate(data: any) {

  console.log("🔥 RAW SOCKET DATA:", data);



  const payload = Array.isArray(data?.data) ? data.data[0] : data;

  if (!payload) {
    console.warn("[Left] No payload found");
    return;
  }

  const userId =
      payload?._id ||
      payload?.userId ;

  console.log("Resolved UserID:", userId);

  if (!userId) {
    console.warn('[Left] No userId found in message update');
    return;
  }

  const text =
      payload?.text ||
      payload?.message ||
      '';

  const createdAt =
      payload?.createdAt ||
      payload?.timestamp ||
      new Date().toISOString();

  this.updateChatPreview(userId, text, createdAt, payload.isRead);
}


  private updateChatPreview(userId: string, text: string, createdAt: string, isRead:any) {
    if (!this.chatList || !this.chatList.length) {
      return;
    }

    const idx = this.chatList.findIndex((c: any) => c._id === userId);
    if (idx === -1) return;

    const updated = {
      ...this.chatList[idx],
      text: text,
      isRead: isRead,
      lastMsgAt: createdAt,
      updatedAt: new Date().toISOString()
    };

    this.chatList.splice(idx, 1);
    this.chatList.unshift(updated);

    this.cdr.detectChanges();
  }

  isActive() {
    if (!this.currentTicketId) return;
    console.log("currentId",this.currentTicketId);


    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.activeStatus + this.currentTicketId;

    const body: SelectedStatus = {
      isActive: this.selectedStatus
    };

    this.navService.postData(apiUrl, body).subscribe({
      next: (res: any) => {
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('[Left] Error updating status:', err)
    });
  }

selectChat(item: any) {
  this.selectedChat = item;

  this.currentTicketId = item.ticketId || null;

  item.isRead = 0;

  this.chatSelected.emit(item._id);
  this.ticket.emit(item.ticketId);

  this.openChat.emit();
  this.isActive();
}



  ngAfterViewInit(): void {
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    if (this.lastMessageSubscription) {
      this.lastMessageSubscription.unsubscribe();
    }
  }

  private setupEventListeners(): void {
    setTimeout(() => {
      const chatItems = document.querySelectorAll<HTMLDivElement>('.chat-item');

      chatItems.forEach((item) => {
        item.addEventListener('click', function () {
          chatItems.forEach((chat) => chat.classList.remove('active'));
          this.classList.add('active');
        });
      });

      const statusToggle = this.sidebar?.nativeElement.querySelector('.status-toggle');

      if (statusToggle) {
        statusToggle.addEventListener('click', (event: Event) => {
          const target = event.currentTarget as HTMLElement;
          const statusIndicator = target.querySelector<HTMLElement>('.status-indicator');
          const statusText = target.querySelector<HTMLElement>('span');

          if (!statusIndicator || !statusText) return;

          const bg = statusIndicator.style.background;

          if (bg === 'var(--success)') {
            statusIndicator.style.background = 'var(--warning)';
            statusText.textContent = 'Away';
            this.selectedStatus = 'Waiting';
          } else if (bg === 'var(--warning)') {
            statusIndicator.style.background = 'var(--gray)';
            statusText.textContent = 'Offline';
            this.selectedStatus = 'Offline';
          } else {
            statusIndicator.style.background = 'var(--success)';
            statusText.textContent = 'Online';
            this.selectedStatus = 'Online';
          }
        });
      }

      if (this.searchInput) {
        this.searchInput.nativeElement.addEventListener('input', () => {
          const searchTerm = this.searchInput.nativeElement.value.toLowerCase();

          chatItems.forEach((item) => {
            const name = item.querySelector<HTMLElement>('.chat-name')?.textContent?.toLowerCase() || '';
            const preview = item.querySelector<HTMLElement>('.chat-preview')?.textContent?.toLowerCase() || '';
            item.style.display = name.includes(searchTerm) || preview.includes(searchTerm) ? 'flex' : 'none';
          });
        });
      }
    }, 0);
  }
}
