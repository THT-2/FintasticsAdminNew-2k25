import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatUser {
  initials: string;
  name: string;
  time: string;
  message: string;
  type: 'registered' | 'subscribed' | 'repeat';
  active?: boolean;
}

interface ChatMessage {
  sender: 'client' | 'agent';
  text: string;
  time: string;
}

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-chats',
  templateUrl: './chats.html',
  styleUrls: ['./chats.scss']
})
export class Chats implements OnInit {
  // Active chats list
  chats: ChatUser[] = [];
  activeChat!: ChatUser;

  // Messages for selected chat
  messages: ChatMessage[] = [];

  // Input message
  newMessage: string = '';

  ngOnInit(): void {
    this.loadChats();
    this.loadMessages();
  }

  loadChats(): void {
    this.chats = [
      {
        initials: 'RS',
        name: 'Rahul Sharma',
        time: '10:25 AM',
        message: 'Hello, I have questions about tax filing for freelancers...',
        type: 'registered',
        active: true
      },
      {
        initials: 'PM',
        name: 'Priya Mehta',
        time: '10:18 AM',
        message: 'Which investment would you recommend for long-term...',
        type: 'subscribed'
      },
      {
        initials: 'AK',
        name: 'Amit Kumar',
        time: '10:05 AM',
        message: 'I need advice on retirement planning options...',
        type: 'repeat'
      },
      {
        initials: 'SM',
        name: 'Sunita Mishra',
        time: '09:45 AM',
        message: 'What documents are needed for home loan tax benefits...',
        type: 'subscribed'
      }
    ];

    this.activeChat = this.chats.find(c => c.active) || this.chats[0];
  }

  loadMessages(): void {
    this.messages = [
      {
        sender: 'client',
        text: 'Hello, I started freelancing this year and I\'m confused about tax filing. What documents do I need to maintain?',
        time: '10:25 AM'
      },
      {
        sender: 'agent',
        text: 'Hello Rahul! For freelancers, you need to maintain records of all your income and expenses. Key documents include bank statements, invoices raised, expense receipts, and if applicable, Form 16A from clients who deducted TDS.',
        time: '10:27 AM'
      },
      {
        sender: 'client',
        text: 'Thanks! Should I file ITR-3 or ITR-4? My annual income is around ₹8 lakhs.',
        time: '10:28 AM'
      },
      {
        sender: 'agent',
        text: 'Since your income is above ₹5 lakhs and you\'re a freelancer, ITR-3 would be appropriate as you\'re required to maintain detailed books of accounts. Have you considered opting for the presumptive taxation scheme under Section 44ADA?',
        time: '10:30 AM'
      }
    ];
  }

  selectChat(chat: ChatUser): void {
    this.chats.forEach(c => (c.active = false));
    chat.active = true;
    this.activeChat = chat;
    this.loadMessages(); // Replace with actual API for chat history
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    this.messages.push({
      sender: 'agent',
      text: this.newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.newMessage = '';
  }

  assignChat(): void {
    alert(`Chat assigned to you: ${this.activeChat.name}`);
  }
}
