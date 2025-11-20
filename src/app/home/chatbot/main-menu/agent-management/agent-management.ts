import { Component } from '@angular/core';
import { AgentCards } from './agent-cards/agent-cards';
import { AgentPerformance } from './agent-performance/agent-performance';


@Component({
  selector: 'app-agent-management',
  imports: [
    AgentCards,
    AgentPerformance],
  templateUrl: './agent-management.html',
  styleUrl: './agent-management.scss'
})
export class AgentManagement {

}
