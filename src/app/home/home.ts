import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Layout } from '../core/layout/layout';
import { ChatNotifyService } from '../Service/chatnotifyservice';
import { NotificationService } from '../Service/notification-service';

@Component({
  selector: 'app-home',
  standalone: true,           // if this was already there in your real code, keep it
  imports: [Layout, RouterOutlet],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  @Input() NavCollapse: boolean = false;
  isCollapsed: boolean = false;

  isChatHistoryPage: boolean = false;

  constructor(
    private router: Router,
    private chatnotify: ChatNotifyService,
    private notificationService: NotificationService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChatHistoryPage = event.url === '/admin/chats';
      });
  }

  ngOnInit(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      this.notificationService.requestPermission();
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userid');

    if (token && userId) {
      this.chatnotify.init(token, userId);
    } else {
      console.warn('[Home] No token or userId in localStorage, chat notifications not started.');
    }
  }

  toggleoutlet() {
    this.NavCollapse = !this.NavCollapse;
  }
}
