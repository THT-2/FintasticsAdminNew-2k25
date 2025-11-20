import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideNav } from "./side-nav/side-nav";
import { Navbar } from "./navbar/navbar";
import { RouterOutlet } from "@angular/router";


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


toggleSidebar() {
  this.isCollapsed = !this.isCollapsed;
  console.log('isCollapsed:', this.isCollapsed);
  this.NavCollapse.emit();
}

}
