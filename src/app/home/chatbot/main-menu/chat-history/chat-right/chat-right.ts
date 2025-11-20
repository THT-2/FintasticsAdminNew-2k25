import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiRoutesConstants } from '../../../../../constants/api-route-constants';
import { Data } from '../../../../../Service/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-right',
  imports:[CommonModule],
  templateUrl: './chat-right.html',
  styleUrls: ['./chat-right.scss']
})
export class ChatRight implements OnChanges {
  @Input() chatSelected: string | null = null;
  @Input() ticket: string | null = null;
  userChat: any[] = [];
items: any;
 ticketId: string | null = null;

  constructor(private navService: Data, private cd:ChangeDetectorRef) {}
  // ngOnChanges(): void {
  //   if (this.chatSelected) {
  //     console.log("selected",this.chatSelected);
  //     this.getUserchatById(this.chatSelected);
  //   }
  //   console.log("tic",this.ticket);

  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatSelected']?.currentValue) {
      this.getUserchatById(this.chatSelected!);
    }
    if (changes['ticket']?.currentValue !== undefined) {
      this.ticketId = this.ticket;
    }
  }

  getUserchatById(id: string) {
    const apiUrl = ApiRoutesConstants.BASE_URL+ApiRoutesConstants.userchats+"/"+id+"/chats";

    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        this.userChat = [];
        if (res.code === 200 && res?.data) {
          if (!this.ticketId) {
            this.ticketId = res.data[0]?.ticket?._id || null;
          }
          for (const chat of res.data) {
            this.userChat.push(chat);
          }
        }
        this.cd.detectChanges();
      },
      error: (err: any) => console.error('Error loading chat:', err)
    });
  }



  agentReply(text:String){
    console.log("jdsjhfn");

    const message = text.trim();
    if (!message || !this.ticketId) return;
    const apiUrl = ApiRoutesConstants.BASE_URL+ApiRoutesConstants.AgentReply+"/"+this.ticketId+"/reply";

    const body = { text: message };

    this.navService.postData(apiUrl, body).subscribe({
      next: (res: any) => {
        console.log('Reply Response:', res);
        if ( res.data) {
          this.userChat.push(res.data);
        }
        this.cd.detectChanges();
      },
      error: (err: any) => console.error('Error sending reply:', err)
    });
  }
}
