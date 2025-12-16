import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideNav } from "./side-nav/side-nav";
import { Navbar } from "./navbar/navbar";
import { Router,NavigationEnd } from "@angular/router";
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-layout',
  imports: [SideNav, Navbar,
    // RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  @Input() isCollapsed: boolean = false;
  @Output() NavCollapse = new EventEmitter();

  constructor(private router: Router){}

 ngOnInit(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects;

        // ✅ Whenever you're on chats (/admin/chats) → collapse sidebar
        if (url.startsWith('/admin/chats')) {
          this.isCollapsed = true;
        }
        // else {
        //   // Optional: auto-expand on all non-chat pages
        //   this.isCollapsed = false;
        // }

        console.log('Route changed:', url, 'isCollapsed:', this.isCollapsed);
      });
  }

toggleSidebar(nextState: boolean) {
  this.isCollapsed = nextState;
  console.log('isCollapsed:', this.isCollapsed);
  this.NavCollapse.emit();
}

}
