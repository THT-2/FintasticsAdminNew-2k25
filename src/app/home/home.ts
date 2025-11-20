import { Component, Input } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Layout } from '../core/layout/layout';

@Component({
  selector: 'app-home',
  imports: [Layout, RouterOutlet],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  @Input() NavCollapse: boolean = false;
  isCollapsed: boolean = false;

  isChatHistoryPage: boolean = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChatHistoryPage = event.url === '/admin/chats';
      });
  }

  toggleoutlet() {
    this.NavCollapse = !this.NavCollapse;
  }
}
