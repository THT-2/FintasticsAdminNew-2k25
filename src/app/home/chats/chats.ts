import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { Left } from "./left/left";
import { Right } from "./right/right";
import { _supportsShadowDom } from '@angular/cdk/platform';
import { ChatCanDeactivate } from '../../Service/chat-block-guard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chats',
  imports: [Left, Right,CommonModule],
  templateUrl: './chats.html',
  styleUrl: './chats.scss',
  encapsulation:ViewEncapsulation.ShadowDom
})
export class Chats implements ChatCanDeactivate{
  selectedChatId: string | null = null;
  selectedTicketId: string | null = null;
  chatActive = false;
  switchCancelled = false;

showSwitchPopup = false;          // controls the colorful popup
pendingChatId: string | null = null; // which chat user is trying to switch to



showLeavePopup = false;                 // controls the LEAVE popup
private leaveResolver?: (v: boolean) => void; // who to resolve guard Promise



confirmLeaveChat(): Promise<boolean> {
  this.showLeavePopup = true;

  return new Promise<boolean>((resolve) => {
    this.leaveResolver = resolve;
  });
}

onLeavePopupAnswer(confirmed: boolean) {
  if (this.leaveResolver) {
    this.leaveResolver(confirmed);  // true = leave, false = stay
    this.leaveResolver = undefined;
  }

  this.showLeavePopup = false;
}


onChatSelected(chatId: string) {
  // If a chat is already active and we are switching to a different chat
  if (
    this.chatActive &&               // chat in progress
    this.selectedChatId &&           // some chat already selected
    this.selectedChatId !== chatId   // new chat is different
  ) {
    this.pendingChatId = chatId;
    this.showSwitchPopup = true;     // show colorful popup
    return;
  }

  // Normal case (first chat, or same chat clicked again)
  this.switchCancelled = false;
  this.selectedChatId = chatId;
}


onTicketSelected(ticketId: string) {
  if (this.switchCancelled) {
    return;
  }
  this.selectedTicketId = ticketId;
}



  canLeaveChat(): boolean {

    return !this.chatActive;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.chatActive) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  startChat() {
    this.chatActive = true;
  }

  endChat() {
    this.chatActive = false;
  }

  confirmChatSwitch(confirmed: boolean) {
  if (confirmed && this.pendingChatId) {
    // User clicked YES -> switch to pending chat
    this.selectedChatId = this.pendingChatId;
    this.switchCancelled = false;
  } else {
    // User clicked NO -> stay on current chat
    this.switchCancelled = true;
  }

  // Reset popup state
  this.pendingChatId = null;
  this.showSwitchPopup = false;
}


}
