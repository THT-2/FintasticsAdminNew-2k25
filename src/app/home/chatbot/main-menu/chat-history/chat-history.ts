import { Component } from '@angular/core';
import { ChatLeft } from "./chat-left/chat-left";
import { ChatRight } from "./chat-right/chat-right";

@Component({
  selector: 'app-chat-history',
  imports: [ChatRight, ChatLeft],
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss'
})
export class ChatHistory {
  selectedChatId: string | null = null;
  selectedTicketId: string | null = null;

   onChatSelected(chatId: string) {
    this.selectedChatId = chatId;
  }

  onTicketSelected(ticketId: string) {
    this.selectedTicketId = ticketId;
  }
}
