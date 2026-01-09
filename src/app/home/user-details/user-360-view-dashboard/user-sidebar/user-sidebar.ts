import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
   imports: [
    CommonModule,
    // Option A (recommended in standalone): import what you use
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './user-sidebar.html',
  styleUrl: './user-sidebar.scss'
})
export class UserSidebar {

  sidebarOpened = true;
  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }
}
