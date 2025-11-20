import { Component } from '@angular/core';
import { Chats } from './chats/chats';
import { FinDash } from './fin-dash/fin-dash';
import { AvailabeAgents } from './availabe-agents/availabe-agents';

@Component({
  selector: 'app-chat-dashboard',
  imports: [Chats,FinDash,AvailabeAgents],
  templateUrl: './chat-dashboard.html',
  styleUrl: './chat-dashboard.scss'
})
export class ChatDashboard {

}
