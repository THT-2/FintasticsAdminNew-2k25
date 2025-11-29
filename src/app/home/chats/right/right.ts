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
import { Subscription } from 'rxjs';
import { Data } from '../../../Service/data';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { Socketservice } from '../../../Service/socketservice';
import { jwtDecode } from 'jwt-decode';
import { AlertService } from '../../../constants/alertservice';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FormControl } from '@angular/forms';

// interface ChatPayload {
//   msg?: any[];
//   name?: any;
//   userId?: string;
//   user?: { _id: string };
//   lastTicket?: { _id: string };
// }

@Component({
  selector: 'app-right',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right.html',
  styleUrl: './right.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  providers:[AlertService]
})
export class Right implements OnChanges, OnInit, OnDestroy {
  @Input() chatSelected: string | null = null;
  @Input() ticket: string | null = null;
  @Output() chatEnded = new EventEmitter<void>();
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  fileUploadControl!: FormControl;
  @Output() getFilePath = new EventEmitter();

  userChat: any[] = [];
  ticketId: string | null = null;
  chat: any;
  userAtBottom: boolean = true;
  selectedFile: File | null = null;
filePreview: string | null = null;
showPopup: boolean = false;
 attach:any[]=['Message', 'Attachments', "AI", "Template"];



  private adminGetSub?: Subscription;
  private userRoomSub?: Subscription;
  private connectedSub?: Subscription;

  private lastMsgId: string | null = null;
  private lastMsgCount = 0;
  message = '';
  typing = false;
  isOtherTyping = false;
  typingTimeout: any;

  subTyping!: Subscription;

  token = localStorage.getItem("token")!;
  userId = localStorage.getItem("userid")!;

  constructor(
    private navService: Data,
    private cd: ChangeDetectorRef,
    private chatService: Socketservice,
    private alertService:AlertService
  ) { }

  ngOnInit() {
    const tokenData: any = jwtDecode(this.token);
    this.userId = tokenData.user_id;
    this.initSocketListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatSelected']?.currentValue) {
      const userId = this.chatSelected!;
      this.userChat = [];
      this.lastMsgId = null;
      this.lastMsgCount = 0;

      if (this.ticket) {
        this.ticketId = this.ticket;
      }

      this.getUserchatById(userId, true);
    }

    if (changes['ticket']?.currentValue !== undefined) {
      this.ticketId = this.ticket;
    }
  }

  ngOnDestroy(): void {
    this.adminGetSub?.unsubscribe();
    this.userRoomSub?.unsubscribe();
    this.connectedSub?.unsubscribe();
  }

  endChat(): void {
    this.chatEnded.emit();
    this.showPopup = false;
  console.log("Chat ended");
  }



  initSocketListener() {
    Socketservice.instance.initSocket({
      token: this.token,
      userId: this.userId,
      joinroom: `finexpertchat:user:${this.userId}`,
      eventName: "chat:adminget",
      onData: (data) => {
        const msgs = Array.isArray(data.msg) ? data.msg : [];
        const newCount = msgs.length;
        const newLastId = newCount ? msgs[newCount - 1]._id ?? null : null;

        if (this.userChat.length === newCount && this.lastMsgId && newLastId && this.lastMsgId === newLastId) {
          return;
        }

        if (!this.ticketId) {
          this.ticketId = data.lastTicket?._id ?? null;
        }

        this.userChat = msgs;
        this.lastMsgCount = newCount;
        this.lastMsgId = newLastId;


        if (newCount > 0 && this.chatSelected) {
          const lastMessage = msgs[newCount - 1];
          if (lastMessage.sender === 'user') {
            this.triggerLastMessageUpdate(this.chatSelected, lastMessage.text, lastMessage.createdAt);
          }
        }
         // Listen typing
   this.subTyping = Socketservice.instance.typing$.subscribe((status) => {
          this.isOtherTyping = status;
          this.cd.detectChanges();
        });

        this.cd.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  getUserchatById(id: string, log: boolean = false): void {
    const apiUrl = `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.userchats}/${id}/chats`;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        const data = res?.data;
        if (!data) return;

        this.chat = data?.name?.username || data?.name || 'User';

        if (res?.code === 200) {
          const msgs = Array.isArray(data.msg) ? data.msg : [];
          const newCount = msgs.length;
          const newLastId = newCount ? msgs[newCount - 1]._id ?? null : null;

          if (this.userChat.length === newCount && this.lastMsgId && newLastId && this.lastMsgId === newLastId) {
            return;
          }

          if (!this.ticketId) {
            this.ticketId = data.lastTicket?._id ?? null;
          }

          this.userChat = msgs;
          this.lastMsgCount = newCount;
          this.lastMsgId = newLastId;

          // Trigger last message update for initial load
          if (newCount > 0 && this.chatSelected) {
            const lastMessage = msgs[newCount - 1];
            this.triggerLastMessageUpdate(this.chatSelected, lastMessage.text, lastMessage.createdAt);
          }

          this.cd.detectChanges();
          this.scrollToBottom(); // Jump straight to bottom
        }
      },
      error: (err: any) => {
        console.error('[Right] Error loading chat:', err);
      }
    });
  }

  agentReply(text: string, type: 'text' | 'end'): void {


  if (type === 'end') {
    const apiUrl = `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.AgentReply}/${this.ticketId}/reply`;

    const body = {
      text: "I’m happy to assist! Is there anything else I can help you with?",
      type: "Template"
    };

    this.navService.postData(apiUrl, body).subscribe({
      next: (res: any) => console.log("Template sent:", res),
      error: (err: any) => console.error("Template send error:", err)
    });

    return;
  }

  const message = text.trim();



  if (this.selectedFile) {
    this.sendAttachment(this.selectedFile);
    console.log("url",this.selectedFile);

    this.removeSelectedFile();
    return;
  }


  if (!message || !this.ticketId || !this.chatSelected) return;

  const apiUrl = `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.AgentReply}/${this.ticketId}/reply`;
  const nowIso = new Date().toISOString();


  const tempMsg: any = {
    _id: 'temp-' + nowIso,
    text: message,
    createdAt: nowIso,
    sender: 'agent'
  };

  // Push temp message
  this.userChat = [...this.userChat, tempMsg];
  this.lastMsgCount = this.userChat.length;

  this.cd.detectChanges();
  this.scrollToBottom(true);

  // Update left-side "last message"
  this.triggerLastMessageUpdate(this.chatSelected, message, nowIso);

  // API call
  const body = { text: message };
  this.navService.postData(apiUrl, body).subscribe({
    next: (res: any) => {
      if (res.data) {
        const realMsg = res.data;
        console.log("realmsg",realMsg);

        this.userChat = this.userChat.map(m =>
          m._id === tempMsg._id ? realMsg : m
        );

        this.triggerLastMessageUpdate(this.chatSelected, message, nowIso);

        this.cd.detectChanges();
        this.scrollToBottom(true);
      }
    },
    error: (err: any) => {
      console.error('[Right] Error sending reply:', err);
    }
  });
}


  private triggerLastMessageUpdate(userId: string | null, text: string, createdAt: string) {
    if (!userId) return;
    const lastMsgData = { userId, text, createdAt, ticketId: this.ticketId };
    this.chatService.triggerLastMessageUpdate(lastMsgData);
  }


  onChatScroll(): void {
  if (!this.chatContainer) return;

  const el = this.chatContainer.nativeElement as HTMLElement;
  const scrollPosition = el.scrollTop + el.clientHeight;
  const scrollHeight = el.scrollHeight;

  const threshold = 60;
  this.userAtBottom = scrollHeight - scrollPosition < threshold;
}

private async scrollToBottom(force: boolean = false): Promise<void> {
  if (!this.chatContainer) return;

  if (!force && !this.userAtBottom) return;

  // ⬇⬇⬇ Important part — instant scroll without animation
  await Promise.resolve();
  await new Promise(r => setTimeout(r, 0));

  const el = this.chatContainer.nativeElement as HTMLElement;
  el.scrollTop = el.scrollHeight;
}


triggerFileUpload() {
  this.fileInput.nativeElement.click();
}
sendAttachment(file: File) {
  if (!file) return;

  const formData = new FormData();
  formData.append('sampleFile', file);

  const imageUploadUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.UPLOAD;

  const timeout = setTimeout(() => {
    this.alertService.toast("error", true, "Upload timed out after 5 minutes.");
  }, 300000);

  this.navService.UploadpostData(imageUploadUrl, formData).subscribe({
    next: (event: HttpEvent<any>) => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round((100 * event.loaded) / (event.total || 1));
        console.log(`File is ${percentDone}% uploaded.`,formData);

      } else if (event.type === HttpEventType.Response) {
        clearTimeout(timeout);
        const res: any = event.body;
        if (res?.Status === 'Success') {
          this.getFilePath.emit(res.Data);
          this.alertService.toast("success", true, res.Message);
        } else {
          this.alertService.toast("error", true, res.Message);
        }
      }
    },
    error: (error) => {
      clearTimeout(timeout);
      this.alertService.toast("error", true, error?.error?.Message || 'Upload failed.');
    }
  });
}


onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedFile = file;

  // Preview only images
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => this.filePreview = reader.result as string;
    reader.readAsDataURL(file);
  } else {
    this.filePreview = null;
  }
}

removeSelectedFile() {
  this.selectedFile = null;
  this.filePreview = null;
}

isImage(file: File): boolean {
  return file.type.startsWith("image/");
}


onTyping() {
    Socketservice.instance.sendTyping(true, `finexpertchat:user:${this.userId}`);

    if (this.typingTimeout) clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      Socketservice.instance.sendTyping(false, `finexpertchat:user:${this.userId}`);
    }, 1000);
}


// isPdf(url: string): boolean {
//   return typeof url === 'string' && /\.pdf$/i.test(url);
// }

isPdf(filePath: string | string[]): boolean {
    console.log("filePath", filePath);

    if (!filePath) return false;

    // Ensure filePath is a string
    const validFilePath = Array.isArray(filePath) ? filePath[0] : filePath;
    // console.log("validFilePath", validFilePath);

    if (typeof validFilePath !== 'string') return false;

    const fileExtension = validFilePath.split('.').pop()?.toLowerCase();
    // console.log("fileExtension", fileExtension);

    const imageExtensions = ['pdf','doc','docx','xls','xlsx','zip','rar'];
    return imageExtensions.includes(fileExtension || '');
}
isOtherFile(url: string): boolean {
  return typeof url === 'string' && /\.(doc|docx|xls|xlsx|zip|rar)$/i.test(url);
}


openInNewTab(url: string) {
  window.open(url, "_blank");
}

formatMessage(text: string): string {
  if (!text) return '';

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank" class="msg-link">${url}</a>`
  );
}

  isImageurl(filePath: string | string[]): boolean {
    console.log("filePath", filePath);

    if (!filePath) return false;

    // Ensure filePath is a string
    const validFilePath = Array.isArray(filePath) ? filePath[0] : filePath;
    // console.log("validFilePath", validFilePath);

    if (typeof validFilePath !== 'string') return false;

    const fileExtension = validFilePath.split('.').pop()?.toLowerCase();
    // console.log("fileExtension", fileExtension);

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return imageExtensions.includes(fileExtension || '');
  }

}
