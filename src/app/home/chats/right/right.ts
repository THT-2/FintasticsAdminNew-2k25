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
  ViewEncapsulation,
  HostListener
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
import { NotificationService } from '../../../Service/notification-service';

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
  phone:any;
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
  mobile: any;
  subTyping!: Subscription;

  token = localStorage.getItem("token")!;
  userId = localStorage.getItem("userid")!;

  constructor(
    private navService: Data,
    private cd: ChangeDetectorRef,
    private chatService: Socketservice,
    private alertService:AlertService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    const tokenData: any = jwtDecode(this.token);
    this.userId = tokenData.user_id;
    this.notificationService.requestPermission();
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

  ngAfterViewInit() {
  setTimeout(() => {
    this.scrollToBottomInstant();
  }, 0);
  this.cd.detectChanges();
}


  ngOnDestroy(): void {
    this.adminGetSub?.unsubscribe();
    this.userRoomSub?.unsubscribe();
    this.connectedSub?.unsubscribe();
    this.subTyping?.unsubscribe();
  }

  endChat(): void {
    this.chatEnded.emit();
    this.showPopup = false;
  console.log("Chat ended");
  }


//   initSocketListener() {
//     Socketservice.instance.initSocket({
//       token: this.token,
//       userId: this.userId,
//       joinroom: `finexpertchat:user:${this.userId}`,
//       eventName: "chat:adminget",
//       onData: (data) => {
//         const msgs = Array.isArray(data.msg) ? data.msg : [];
//         const newCount = msgs.length;
//         const newLastId = newCount ? msgs[newCount - 1]._id ?? null : null;

//         if (this.userChat.length === newCount && this.lastMsgId && newLastId && this.lastMsgId === newLastId) {
//           return;
//         }

//         if (!this.ticketId) {
//           this.ticketId = data.lastTicket?._id ?? null;
//         }

//         this.userChat = msgs;
//         this.lastMsgCount = newCount;
//         this.lastMsgId = newLastId;


//         if (newCount > 0 && this.chatSelected) {
//   const lastMessage = msgs[newCount - 1];

//   if (lastMessage.sender === 'user') {
//     this.triggerLastMessageUpdate(
//       this.chatSelected,
//       lastMessage.text,
//       lastMessage.createdAt
//     );

//     // 🔔 Show desktop notification when tab is not visible (like WhatsApp Web)
//     if (document.visibilityState === 'hidden') {
//       this.notificationService.showNotification(
//         this.chat || 'New message',
//         {
//           body: lastMessage.text || 'New message',
//           icon: 'assets/favicon.ico'  // this loads from /assets/favicon.ico
//         }
//       );
//     }
//   }
// }

//         // Listen typing
//           this.subTyping = Socketservice.instance.typing$.subscribe((status) => {
//           this.isOtherTyping = status;
//           this.cd.detectChanges();
//         });

//         this.cd.detectChanges();
//         this.scrollToBottomInstant();

//       }
//     });
//   }
initSocketListener() {
  Socketservice.instance.initSocket({
    token: this.token,
    userId: this.userId,
    joinroom: `finexpertchat:user:${this.userId}`,
    eventName: "chat:adminget",
    onData: (data) => {
      console.log('[Right] Socket data received:', data);

      const msgs = Array.isArray(data.msg) ? data.msg : [];
      const newCount = msgs.length;
      const newLastId = newCount ? msgs[newCount - 1]._id ?? null : null;

      // Avoid duplicate updates
      if (this.userChat.length === newCount && this.lastMsgId && newLastId && this.lastMsgId === newLastId) {
        console.log('[Right] No new messages, skipping');
        return;
      }

      if (!this.ticketId) {
        this.ticketId = data.lastTicket?._id ?? null;
      }

      this.userChat = msgs;
      this.lastMsgCount = newCount;
      this.lastMsgId = newLastId;

      if (newCount > 0) {
  const lastMessage = msgs[newCount - 1];
  console.log('[Right] Last message:', lastMessage);

  const isFromUser =
    lastMessage.sender === 'user' ||
    lastMessage.senderRole === 'user';

  if (isFromUser) {
    if (this.chatSelected) {
      this.triggerLastMessageUpdate(
        this.chatSelected,
        lastMessage.text,
        lastMessage.createdAt
      );
    }


    const userName =
      this.chat ||
      data?.name?.username ||
      data?.name ||
      lastMessage.userName ||
      'New message';

    console.log('[Right] New user message from:', userName);

    this.notificationService.showNotification(
      userName,
      {
        body: lastMessage.text || 'New message',
        icon: 'assets/favicon.ico'
      }
    );
  }
}

      // Listen typing
      this.subTyping = Socketservice.instance.typing$.subscribe((status) => {
        this.isOtherTyping = status;
        this.cd.detectChanges();
      });

      this.cd.detectChanges();
      this.scrollToBottomInstant();
    }
  });
}


  getUserchatById(id: string, log: boolean = false): void {
    const apiUrl = `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.userchats}/${id}/chats`;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        const data = res?.data;
        if (!data) return;
        console.log(data);

        this.chat = data?.name?.username || data?.name || 'User';
        console.log(this.chat);
        this.mobile =data.mobile_num;
        console.log(this.mobile);

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

        }
      },
      error: (err: any) => {
        console.error('[Right] Error loading chat:', err);
      }
    });
  }

dropdownOpen = false;

predefinedQuestions: string[] = [
"How may I help you today?",
"Happy to assist you with Fintastics!",
"What can I do for you right now?",
"Need help with expense tracking or budgets?",
"Would you like support with account setup?",
"Are you facing any issue with automatic SMS tracking?",
"Do you want to know how the 30-Day Challenge works?",
"Want to understand how to create customized budgets?",
"Would you like to explore premium features and rewards?",
"Need help with subscription or billing?",
"Want to learn how to categorize your expenses?",
"Looking for help with data backup or restore?",
"Do you need guidance on bank transaction sync?",
"Would you like insights on saving habits?",
"Want help in tracking family/group expenses?",
"Need assistance with your expense reports or exporting data?",
"Do you want to set financial goals in the app?",
"Have questions about security or data privacy?",
"How is your experience with Fintastics so far?",
"How would you rate our conversation today?",
"Any suggestions to improve your experience?"
];

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}


agentReply(text: string, type: 'text' | 'end' | 'questions'): void {
  const trimmed = (text || '').trim();

  // Don't send empty messages unless there's a file or it's 'end'
  if (type !== 'end' && !trimmed && !this.selectedFile) {
    return;
  }

  // 1) If it's an END TEMPLATE message
  if (type === 'end') {
    const apiUrl = `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.AgentReply}/${this.ticketId}/reply`;

    const body = {
      text: "I’m happy to assist! Is there anything else I can help you with?",
      type: "Template"
    };

    this.navService.postData(apiUrl, body).subscribe({
      next: (res: any) => console.log("Template sent:", res),
      error: (err: any) => console.error("Template send error:", err)
    });

    return;
  }

  // 2) If there is a selected file, send it first
  if (this.selectedFile) {
    this.sendAttachment(this.selectedFile);
    console.log("url", this.selectedFile);

    this.removeSelectedFile();

    // If there is NO text along with the file, we are done
    if (!trimmed) {
      return;
    }
    // If there IS text too, we continue and send the text as a normal message
  }

  // 3) Handle predefined question text
  if (type === 'text' || type === 'questions') {
    this.dropdownOpen = false;

    const message = type === 'questions' ? text : trimmed; // for questions we trust the predefined text
    const nowIso = new Date().toISOString();

    const tempMsg: any = {
      _id: 'temp-' + nowIso,
      text: message,
      createdAt: nowIso,
      sender: 'agent'
    };

    this.userChat = [...this.userChat, tempMsg];
    this.lastMsgCount = this.userChat.length;

    this.cd.detectChanges();
    this.scrollToBottomInstant();

    this.triggerLastMessageUpdate(this.chatSelected, message, nowIso);

    const apiUrl = `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.AgentReply}/${this.ticketId}/reply`;
    const body = { text: message };

    this.navService.postData(apiUrl, body).subscribe({
      next: (res: any) => {
        if (res.data) {
          const realMsg = res.data;

          this.userChat = this.userChat.map(m =>
            m._id === tempMsg._id ? realMsg : m
          );

          this.triggerLastMessageUpdate(this.chatSelected, message, nowIso);

          this.cd.detectChanges();
          this.scrollToBottomInstant();
        }
      },
      error: (err: any) => {
        console.error("Predefined question / text send error:", err);
      }
    });

    return;
  }
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

private scrollToBottomInstant() {
  setTimeout(() => {
    if (this.chatContainer?.nativeElement) {
      const el = this.chatContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }, 50);
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
        console.log(`File is ${percentDone}% uploaded.`, formData);

      } else if (event.type === HttpEventType.Response) {
        clearTimeout(timeout);
        const res: any = event.body;

        if (res?.Status === 'Success') {
          const fileUrl = res.Data; // assume backend returns URL or path string
          console.log('Uploaded file URL:', fileUrl);

          // 1) Push a temp message into chat so it’s visible immediately
          const nowIso = new Date().toISOString();
          const tempMsg: any = {
            _id: 'temp-' + nowIso,
            text: '',                 // or file.name if you want
            attachments: [fileUrl],   // IMPORTANT: matches your template
            createdAt: nowIso,
            sender: 'agent'
          };

          this.userChat = [...this.userChat, tempMsg];
          this.lastMsgCount = this.userChat.length;

          this.cd.detectChanges();
          this.scrollToBottomInstant();

          // 2) Optionally send as a real chat message to backend
          if (this.ticketId) {
            const apiUrl =
              `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.AgentReply}/${this.ticketId}/reply`;

            const body: any = {
              attachments: [fileUrl]
              // you can also send text: file.name or type: 'file' if your API expects it
            };

            this.navService.postData(apiUrl, body).subscribe({
              next: (replyRes: any) => {
                if (replyRes.data) {
                  const realMsg = replyRes.data;

                  this.userChat = this.userChat.map(m =>
                    m._id === tempMsg._id ? realMsg : m
                  );

                  this.cd.detectChanges();
                  this.scrollToBottomInstant();
                }
              },
              error: (err: any) => {
                console.error('[Right] Error sending attachment message:', err);
              }
            });
          }

          // 3) Keep your existing emitter/toast if parent needs the URL
          this.getFilePath.emit(fileUrl);
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

onEnter(msg: HTMLTextAreaElement) {
  const value = msg.value || '';
  const trimmed = value.trim();

  if (!trimmed && !this.selectedFile) {
    return;
  }

  this.agentReply(value, 'text');
  msg.value = '';
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

makeClickable(text: string) {
  if (!text) return text;

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.replace(urlRegex, url =>
    `<a href="${url}" target="_blank">${url}</a>`
  );
}


onTyping() {
    Socketservice.instance.sendTyping(true);

    if (this.typingTimeout) clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      Socketservice.instance.sendTyping(false);
    }, 1000);
}


isPdf(filePath: string | string[]): boolean {
    // console.log("filePath", filePath);

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
    // console.log("filePath", filePath);

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
