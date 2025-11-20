import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { Data } from '../../../Service/data';
import { Chatservice } from '../../../Service/chatservice';
import { filter } from 'rxjs';

type StatusValue = 'Online' | 'Offline' | 'Waiting';

interface SelectedStatus {
  isActive: StatusValue;
}

@Component({
  selector: 'app-left',
  imports: [],
  templateUrl: './left.html',
  styleUrl: './left.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [AlertService]
})
export class Left implements OnInit, AfterViewInit {
  public apiUrl =
    ApiRoutesConstants.BASE_URL + ApiRoutesConstants.agentchatlist;

  chatList: any[] = [];
  selectedChat: any = null;

  // current agent status (what will be sent to API)
  selectedStatus: StatusValue = 'Online';

  // currently selected ticket id (used by isActive API call)
  currentTicketId: string | null = null;

  @Output() chatSelected = new EventEmitter<string>();
  @Output() ticket = new EventEmitter<string>();
  @Output() openChat = new EventEmitter<void>();

  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;

  roomsJoined = false;

  constructor(
    private navService: Data,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private chatService: Chatservice
  ) {}

  ngOnInit(): void {
    console.log('[Left] ngOnInit');

    // 1) Load chat list
    this.getchatList();

    // 2) When socket connects, join rooms + start listening for lastMsg updates
    this.chatService.connected$
      .pipe(filter((isConnected) => isConnected === true))
      .subscribe(() => {
        console.log('[Left] Socket connected, ready to join rooms');

        this.joinAllUserRooms();

        // this will only be attached once since it's on the same socket instance
        this.chatService.listenToUserLastMsg().subscribe((payload) => {
          console.log('[Left] chat:userlastMsg payload:', payload);
          this.handleUserLastMsg(payload);
        });
      });

    // 3) Listen to lastMsg$ from Right (history loads / fallback)
    this.chatService.lastMsg$.subscribe(({ userId, text, createdAt }) => {
      console.log('[Left] lastMsg$ update:', { userId, text, createdAt });
      this.updatePreview(userId, text, createdAt);
    });
  }

  getchatList() {
    this.chatList = [];
    this.navService.getData(this.apiUrl).subscribe({
      next: (res: any) => {
        console.log('[Left] chats', res);

        if (res.code === 200) {
          this.chatList = res.data;
          console.log('[Left] chatlist', this.chatList);

          if (this.chatService.isConnected) {
            this.joinAllUserRooms();
          }
        } else {
          this.alertService.toast('error', true, res.message);
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.toast('error', true, error);
      }
    });
  }

  private joinAllUserRooms() {
    if (this.roomsJoined || !this.chatList || this.chatList.length === 0) {
      console.log('[Left] No chats to join or rooms already joined.');
      return;
    }

    console.log('[Left] Joining rooms for all chats in list');

    for (const chat of this.chatList) {
      const userId = chat._id;
      if (!userId) continue;

      const roomName = `finexpertchat:user:${userId}`;
      this.chatService.joinRoom(roomName);
    }

    this.roomsJoined = true;
  }

  // If backend later sends chat:userlastMsg, this will also work:
  private handleUserLastMsg(payload: any) {
    console.log('[Left] handleUserLastMsg payload:', payload);

    let lastMsgObj: any = null;

    if (Array.isArray(payload?.msg) && payload.msg.length > 0) {
      lastMsgObj = payload.msg[payload.msg.length - 1];
    } else if (payload?.msg && typeof payload.msg === 'object') {
      lastMsgObj = payload.msg;
    } else if (payload?.lastMsg && typeof payload.lastMsg === 'object') {
      lastMsgObj = payload.lastMsg;
    } else {
      lastMsgObj = payload;
    }

    const userId =
      payload?.userId ||
      payload?.user?._id ||
      lastMsgObj?.userId ||
      payload?._id ||
      null;

    if (!userId) {
      console.warn('[Left] No userId in chat:userlastMsg payload');
      return;
    }

    const text =
      lastMsgObj?.text ||
      payload?.text ||
      payload?.lastMsg?.text ||
      '';

    const createdAt =
      lastMsgObj?.createdAt ||
      payload?.createdAt ||
      payload?.lastMsg?.createdAt ||
      new Date().toISOString();

    this.updatePreview(userId, text, createdAt);
  }

  // Common update logic (used by socket + lastMsg$)
  private updatePreview(userId: string, text: string, createdAt: string) {
    if (!this.chatList || !this.chatList.length) return;

    const idx = this.chatList.findIndex((c: any) => c._id === userId);
    if (idx === -1) {
      console.warn('[Left] No matching chat found for userId', userId);
      return;
    }

    const chat = this.chatList[idx];

    // Your left.html probably uses something like:
    // {{ chat.name }} and {{ chat.text }} as last message
    chat.text = text;
    (chat as any).lastMsgAt = createdAt;

    this.chatList = [...this.chatList];
    this.cdr.detectChanges();

    console.log('[Left] Updated chatList after preview update:', this.chatList);
  }


  isActive() {
    if (!this.currentTicketId) {
      console.warn('[Left] isActive called with no currentTicketId');
      return;
    }

    const apiUrl =
      ApiRoutesConstants.BASE_URL +
      ApiRoutesConstants.activeStatus +
      this.currentTicketId;

    const body: SelectedStatus = {
      isActive: this.selectedStatus
    };

    this.navService.postData(apiUrl, body).subscribe({
      next: (res: any) => {
        console.log('[Left] status update:', res);
        this.cdr.detectChanges();
      },
      error: (err: any) =>
        console.error('[Left] Error updating status:', err)
    });
  }

  selectChat(item: any) {
    this.selectedChat = item;
    this.currentTicketId = item.ticketId || null;

    console.log('[Left] Chat selected:', item);
    this.chatSelected.emit(item._id);
    this.ticket.emit(item.ticketId);
    this.openChat.emit();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    const chatItems =
      document.querySelectorAll<HTMLDivElement>('.chat-item');

    chatItems.forEach((item) => {
      item.addEventListener('click', function () {
        chatItems.forEach((chat) => chat.classList.remove('active'));
        this.classList.add('active');
      });
    });

    const statusToggle =
      this.sidebar?.nativeElement.querySelector('.status-toggle');

    if (statusToggle) {
      statusToggle.addEventListener(
        'click',
        (event: { currentTarget: HTMLElement }) => {
          const target = event.currentTarget as HTMLElement;
          const statusIndicator =
            target.querySelector<HTMLElement>('.status-indicator');
          const statusText = target.querySelector<HTMLElement>('span');

          if (!statusIndicator || !statusText) return;

          const bg = statusIndicator.style.background;

          // NOTE: map UI states to your status enum
          if (bg === 'var(--success)') {
            // Online -> Away/Waiting
            statusIndicator.style.background = 'var(--warning)';
            statusText.textContent = 'Away';
            this.selectedStatus = 'Waiting';
          } else if (bg === 'var(--warning)') {
            // Away -> Offline
            statusIndicator.style.background = 'var(--gray)';
            statusText.textContent = 'Offline';
            this.selectedStatus = 'Offline';
          } else {
            // Offline (or initial) -> Online
            statusIndicator.style.background = 'var(--success)';
            statusText.textContent = 'Online';
            this.selectedStatus = 'Online';
          }

          console.log('[Left] Status changed to:', this.selectedStatus);
        }
      );
    }

    if (this.searchInput) {
      this.searchInput.nativeElement.addEventListener('input', () => {
        const searchTerm =
          this.searchInput.nativeElement.value.toLowerCase();
        chatItems.forEach((item) => {
          const name =
            item
              .querySelector<HTMLElement>('.chat-name')
              ?.textContent?.toLowerCase() || '';
          const preview =
            item
              .querySelector<HTMLElement>('.chat-preview')
              ?.textContent?.toLowerCase() || '';
          item.style.display =
            name.includes(searchTerm) || preview.includes(searchTerm)
              ? 'flex'
              : 'none';
        });
      });
    }
  }
}
