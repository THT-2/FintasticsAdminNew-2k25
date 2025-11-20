import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ApiRoutesConstants } from '../../../../../constants/api-route-constants';
import { AlertService } from '../../../../../constants/alertservice';
import { Data } from '../../../../../Service/data';
@Component({
  selector: 'app-chat-left',
  templateUrl: './chat-left.html',
  styleUrls: ['./chat-left.scss'],
  providers:[AlertService]
})
export class ChatLeft implements AfterViewInit {
  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.agentchatlist;
  // public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.chatlist;
  chatList:any;
  selectedChat: any = null;

  @Output() chatSelected = new EventEmitter<string>();
  @Output() ticket = new EventEmitter<string>();

  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private navService: Data,
    private alertService: AlertService, private cdr: ChangeDetectorRef){
  }

  ngOnInit(): void {
    this.getchatList();
  }

  getchatList(){
    this.chatList=[];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log('chats',res);

        if (res.code === 200) {
          this.chatList = res.data;
          console.log('chatlist',this.chatList);
        }

        else {
          this.alertService.toast("error",true,res.message);
        }
        this.cdr.detectChanges();
      },
      error: (error:any) => {
        console.log(error);
        this.alertService.toast("error",true,error);
      }
    })

  }

   selectChat(item: any) {
    this.selectedChat = item;
    console.log('Chat selected:', item);
    this.chatSelected.emit(item._id);
    this.ticket.emit(item.ticketId);
  }

  ngAfterViewInit(): void {
    const chatItems = document.querySelectorAll<HTMLDivElement>('.chat-item');

    chatItems.forEach((item) => {
      item.addEventListener('click', function () {
        chatItems.forEach(chat => chat.classList.remove('active'));
        this.classList.add('active');
      });
    });

    const statusToggle = this.sidebar.nativeElement.querySelector('.status-toggle');
statusToggle.addEventListener('click', (event: { currentTarget: HTMLElement; }) => {
  const target = event.currentTarget as HTMLElement;
  const statusIndicator = target.querySelector<HTMLElement>('.status-indicator');
  const statusText = target.querySelector<HTMLElement>('span');

  if (!statusIndicator || !statusText) return;

  const bg = statusIndicator.style.background;
  if (bg === 'var(--success)') {
    statusIndicator.style.background = 'var(--warning)';
    statusText.textContent = 'Away';
  } else if (bg === 'var(--warning)') {
    statusIndicator.style.background = 'var(--gray)';
    statusText.textContent = 'Offline';
  } else {
    statusIndicator.style.background = 'var(--success)';
    statusText.textContent = 'Online';
  }
});

    if (this.searchInput) {
      this.searchInput.nativeElement.addEventListener('input', () => {
        const searchTerm = this.searchInput.nativeElement.value.toLowerCase();
        chatItems.forEach((item) => {
          const name = item.querySelector<HTMLElement>('.chat-name')?.textContent?.toLowerCase() || '';
          const preview = item.querySelector<HTMLElement>('.chat-preview')?.textContent?.toLowerCase() || '';
          item.style.display = (name.includes(searchTerm) || preview.includes(searchTerm)) ? 'flex' : 'none';
        });
      });
    }
  }
}
