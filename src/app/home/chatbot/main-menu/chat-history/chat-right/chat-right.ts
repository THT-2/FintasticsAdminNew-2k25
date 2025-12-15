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
import { jwtDecode } from 'jwt-decode';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FormControl } from '@angular/forms';
// import { NotificationService } from '../../../Service/notification-service';
import { log } from 'node:console';
import { Clipboard } from '@angular/cdk/clipboard';
import { AlertService } from '../../../../../constants/alertservice';
import { Socketservice } from '../../../../../Service/socketservice';
import { Data } from '../../../../../Service/data';
import { ApiRoutesConstants } from '../../../../../constants/api-route-constants';

@Component({
  selector: 'app-chat-right',
  imports:[CommonModule],
  templateUrl: './chat-right.html',
  styleUrls: ['./chat-right.scss'],
  providers: [AlertService]
})
export class ChatRight implements OnChanges {

  @Input() chatSelected: string | null = null;
  @Input() ticket: string | null = null;
  @Output() chatEnded = new EventEmitter<void>();
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  @Output() getFilePath = new EventEmitter();

  dropdownOpen = false;
  fileUploadControl!: FormControl;
  userChat: any[] = [];
  phone: any;
  ticketId: string | null = null;
  chat: any;
  userAtBottom: boolean = true;
  selectedFile: File | null = null;
  filePreview: string | null = null;
  showPopup: boolean = false;
  attach: any[] = ['Message', 'Attachments', 'AI', 'Template'];

  private adminGetSub?: Subscription;
  private userRoomSub?: Subscription;
  private connectedSub?: Subscription;

  private lastMsgId: string | null = null;
  private lastMsgCount = 0;
  message = '';
  typing = false;
  isOtherTyping = false;
  copied = false;
  typingTimeout: any;
  mobile: any;
  subTyping!: Subscription;

  token = localStorage.getItem('token')!;
  userId = localStorage.getItem('userid')!;
  username = localStorage.getItem('username')!;

  constructor(
    private navService: Data,
    private cd: ChangeDetectorRef,
    private chatService: Socketservice,
    private alertService: AlertService,
    private clipboard: Clipboard,
    // private notificationService: NotificationService
  ) {}




  ngOnInit() {
    const tokenData: any = jwtDecode(this.token);
    this.userId = tokenData.user_id;
    // this.notificationService.requestPermission();
    this.initSocketListener();
    console.log(this.userId);
    console.log(this.username);
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



copyMobile() {
  this.clipboard.copy(this.mobile);

  this.copied = true;

  setTimeout(() => {
    this.copied = false;
  }, 2000); // 2 seconds
}


  endChat(): void {
    this.chatEnded.emit();
    this.showPopup = false;
    console.log('Chat ended');
  }

initSocketListener() {
  // 1️⃣ Init socket and message handling (unchanged)
  Socketservice.instance.initSocket({
    token: this.token,
    userId: this.userId,
    joinroom: `finexpertchat:user:${this.userId}`,
    eventName: 'chat:adminget',
    onData: (data) => {
      console.log('[Right] Socket data received:', data);

      const msgs = Array.isArray(data.msg) ? data.msg : [];
      const newCount = msgs.length;
      const newLastId = newCount ? msgs[newCount - 1]._id ?? null : null;

      const incomingName = data?.name || null;
      const incomingMobile = data?.mobile_num || null;

      const currentName = this.chat || null;
      const currentMobile = this.mobile || null;

      const isDifferentUser =
        (!!currentMobile && !!incomingMobile && currentMobile !== incomingMobile) ||
        (!!currentName && !!incomingName && currentName !== incomingName);

      if (isDifferentUser) {
        console.log('[Right] Message is for another user. Not updating open chat body.', {
          incomingName,
          incomingMobile,
          currentName,
          currentMobile
        });
        return;
      }

      if (this.userChat.length === newCount && this.lastMsgId && newLastId && this.lastMsgId === newLastId) {
        console.log('[Right] No new messages, skipping');
        return;
      }

      if (!this.ticketId) {
        this.ticketId = data.lastTicket?._id ?? data.lastTicket ?? null;
      }

      this.userChat = msgs;
      this.lastMsgCount = newCount;
      this.lastMsgId = newLastId;

      if (newCount > 0) {
        const lastMessage = msgs[newCount - 1];
        console.log('[Right] Last message:', lastMessage);

        const previewText = this.getPreviewFromMessage(lastMessage);

        if (this.chatSelected && previewText !== undefined) {
          this.triggerLastMessageUpdate(this.chatSelected, previewText, lastMessage.createdAt);
        }
      }

      this.cd.detectChanges();
      this.scrollToBottomInstant();
    }
  });

  // 2️⃣ Typing indicator — subscribe ONCE, and tie it to chatSelected
  if (this.subTyping) {
    this.subTyping.unsubscribe();
  }

  this.subTyping = Socketservice.instance.typing$.subscribe((data: any) => {
    console.log(
      'newdatesocket',
      data,
      'admin userId:',
      this.userId,
      'chatSelected:',
      this.chatSelected
    );

    if (!data) return;

    const typingUserId = String(data.userId || '');
    const selectedUserId = String(this.chatSelected || '');
    const isTyping = !!data.isTyping;

    // ✅ Show typing ONLY if:
    // 1. The event belongs to the currently opened chat user
    if (typingUserId === selectedUserId && isTyping) {
      this.isOtherTyping = true;
    }
    // ✅ Stop typing ONLY for that same user
    else if (typingUserId === selectedUserId && !isTyping) {
      this.isOtherTyping = false;
    }

    // Events for other users (typingUserId !== selectedUserId) are ignored

    this.cd.detectChanges();
  });
}



  private getPreviewFromMessage(msg: any): string {
    // 1. If there's normal text, use it
    const baseText = (msg?.text || '').toString().trim();
    if (baseText) return baseText;

    // 2. No text → check attachments
    const attachments: any[] = Array.isArray(msg?.attachments) ? msg.attachments : [];

    if (!attachments.length) {
      // 3. Fallback to type if available
      const type = (msg?.type || '').toString().toLowerCase();

      if (type.includes('image') || type === 'photo') return '📷 Photo';
      if (type.includes('file') || type.includes('doc')) return '📄 Document';
      if (type.includes('attach')) return '📎 Attachment';

      return '';
    }

    const first = attachments[0];
    const url = typeof first === 'string' ? first : first?.url || first?.path || '';

    const ext = url.split('.').pop()?.toLowerCase() || '';

    const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const docExt = ['pdf', 'doc', 'docx', 'txt'];
    const sheetExt = ['xls', 'xlsx', 'csv'];
    const zipExt = ['zip', 'rar', '7z'];

    if (imageExt.includes(ext)) {
      return attachments.length > 1 ? `📷 ${attachments.length} photos` : '📷 Photo';
    }

    if (docExt.includes(ext)) {
      return ext === 'pdf' ? '📄 PDF document' : '📄 Document';
    }

    if (sheetExt.includes(ext)) {
      return '📊 Spreadsheet';
    }

    if (zipExt.includes(ext)) {
      return '🗜️ Compressed file';
    }

    return attachments.length > 1 ? `📎 ${attachments.length} attachments` : '📎 Attachment';
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
        this.mobile = data.mobile_num;
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
            const preview = this.getPreviewFromMessage(lastMessage);
            this.triggerLastMessageUpdate(this.chatSelected, preview || lastMessage.text, lastMessage.createdAt);
          }

          this.cd.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('[Right] Error loading chat:', err);
      }
    });
  }

  predefinedQuestions: string[] = [
    'How may I help you today?',
    'Happy to assist you with Fintastics!',
    'What can I do for you right now?',
    'Need help with expense tracking or budgets?',
    'Would you like support with account setup?',
    'Are you facing any issue with automatic SMS tracking?',
    'Do you want to know how the 30-Day Challenge works?',
    'Want to understand how to create customized budgets?',
    'Would you like to explore premium features and rewards?',
    'Need help with subscription or billing?',
    'Want to learn how to categorize your expenses?',
    'Looking for help with data backup or restore?',
    'Do you need guidance on bank transaction sync?',
    'Would you like insights on saving habits?',
    'Want help in tracking family/group expenses?',
    'Need assistance with your expense reports or exporting data?',
    'Do you want to set financial goals in the app?',
    'Have questions about security or data privacy?',
    'How is your experience with Fintastics so far?',
    'How would you rate our conversation today?',
    'Any suggestions to improve your experience?'
  ];

  toggleDropdown(event?: MouseEvent) {
    event?.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  onQuestionClick(q: string, event: MouseEvent) {
    event.stopPropagation();
    this.agentReply(q, 'questions');
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.dropdownContainer.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
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
        text: 'I’m happy to assist! Is there anything else I can help you with?',
        type: 'Template'
      };

      this.navService.postData(apiUrl, body).subscribe({
        next: (res: any) => console.log('Template sent:', res),
        error: (err: any) => console.error('Template send error:', err)
      });

      return;
    }

    // 2) If there is a selected file, send it first
    if (this.selectedFile) {
      this.sendAttachment(this.selectedFile);
      console.log('url', this.selectedFile);

      this.removeSelectedFile();

      // If there is NO text along with the file, we are done
      if (!trimmed) {
        return;
      }
      // If there IS text too, we continue and send the text as a normal message
    }

    // 3) Handle predefined question / normal text
    if (type === 'text' || type === 'questions') {
      this.dropdownOpen = false;

      const message = type === 'questions' ? text : trimmed;
      const nowIso = new Date().toISOString();

      const tempMsg: any = {
        _id: 'temp-' + nowIso,
        text: message,
        createdAt: nowIso,
        sender: 'agent',
        type: 'Message' // 👈 TEXT MESSAGE
      };

      this.userChat = [...this.userChat, tempMsg];
      this.lastMsgCount = this.userChat.length;

      this.cd.detectChanges();
      this.scrollToBottomInstant();

      this.triggerLastMessageUpdate(this.chatSelected, message, nowIso);

      const apiUrl = `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.AgentReply}/${this.ticketId}/reply`;
      const body = { text: message, type: 'Message' };

      this.navService.postData(apiUrl, body).subscribe({
        next: (res: any) => {
          if (res.data) {
            const realMsg = res.data;

            this.userChat = this.userChat.map((m) => (m._id === tempMsg._id ? realMsg : m));

            this.triggerLastMessageUpdate(this.chatSelected, message, nowIso);

            this.cd.detectChanges();
            this.scrollToBottomInstant();
          }
        },
        error: (err: any) => {
          console.error('Predefined question / text send error:', err);
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
      this.alertService.toast('error', true, 'Upload timed out after 5 minutes.');
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
              text: '',
              attachments: [fileUrl],
              createdAt: nowIso,
              sender: 'agent',
              type: 'Attachments' // 👈 ATTACHMENT MESSAGE
            };

            this.userChat = [...this.userChat, tempMsg];
            this.lastMsgCount = this.userChat.length;

            this.cd.detectChanges();
            this.scrollToBottomInstant();

            // 2) send as a real chat message to backend
            if (this.ticketId) {
              const apiUrl = `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.AgentReply}/${this.ticketId}/reply`;

              const body: any = {
                attachments: [fileUrl],
                type: 'Attachments'
              };

              this.navService.postData(apiUrl, body).subscribe({
                next: (replyRes: any) => {
                  if (replyRes.data) {
                    const realMsg = replyRes.data;

                    this.userChat = this.userChat.map((m) => (m._id === tempMsg._id ? realMsg : m));

                    this.cd.detectChanges();
                    this.scrollToBottomInstant();
                  }
                },
                error: (err: any) => {
                  console.error('[Right] Error sending attachment message:', err);
                }
              });
            }

            // 3) existing emitter/toast
            this.getFilePath.emit(fileUrl);
            this.alertService.toast('success', true, res.Message);
          } else {
            this.alertService.toast('error', true, res.Message);
          }
        }
      },
      error: (error) => {
        clearTimeout(timeout);
        this.alertService.toast('error', true, error?.error?.Message || 'Upload failed.');
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
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => (this.filePreview = reader.result as string);
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
    return file.type.startsWith('image/');
  }

  makeClickable(text: string) {
    if (!text) return text;

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
  }

  onTyping() {
    Socketservice.instance.sendTyping(true, this.chatSelected);

    if (this.typingTimeout) clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      Socketservice.instance.sendTyping(false, this.chatSelected);
    }, 1000);
  }

  isPdf(filePath: string | string[]): boolean {
    if (!filePath) return false;

    const validFilePath = Array.isArray(filePath) ? filePath[0] : filePath;

    if (typeof validFilePath !== 'string') return false;

    const fileExtension = validFilePath.split('.').pop()?.toLowerCase();
    const fileExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'];
    return fileExtensions.includes(fileExtension || '');
  }

  isOtherFile(url: string): boolean {
    return typeof url === 'string' && /\.(doc|docx|xls|xlsx|zip|rar)$/i.test(url);
  }

  openInNewTab(url: string) {
    window.open(url, '_blank');
  }

  formatMessage(text: string): string {
    if (!text) return '';

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" class="msg-link">${url}</a>`);
  }

  isImageurl(filePath: string | string[]): boolean {
    if (!filePath) return false;

    const validFilePath = Array.isArray(filePath) ? filePath[0] : filePath;

    if (typeof validFilePath !== 'string') return false;

    const fileExtension = validFilePath.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return imageExtensions.includes(fileExtension || '');
  }
}
