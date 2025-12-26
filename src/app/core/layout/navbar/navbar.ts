import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../constants/alertservice';
import { MessageDialogue } from '../../../Z-Commons/message-dialogue/message-dialogue';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HomeRoutingModule } from "../../../home/home-routing-module";


function isTrue(v: any): boolean {
  return v === true || v === 'true' || v === 1 || v === '1';
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HomeRoutingModule, MatDialogModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  providers:[AlertService]
})
export class Navbar {
  @Input() isCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<boolean>();

  isDarkMode = false;
user_ip: any;

  get username(): string {
    return localStorage.getItem('username') || '';
  }
  get ip(): string {
    return localStorage.getItem('user_ip') || '';
  }

  /**
   * Show chat icon only if:
   *  - permissions contain parent id === 'mainmenu'
   *  - AND that parent has checked === true
   *  - (optional) AND chats submenu checked === true
   */
  get canShowChatIcon(): boolean {
  const permStr = localStorage.getItem('permissions');
  if (!permStr) return false;

  try {
    const permissions = JSON.parse(permStr);
    const mainMenu = permissions.find((p: any) => p.id === 'mainmenu');
    return !!mainMenu && (
      mainMenu.checked === true ||
      mainMenu.checked === 1 ||
      mainMenu.checked === '1'
    );
  } catch {
    return false;
  }
}

  constructor(
    private dialog: MatDialog,
    private renderer: Renderer2,
    private router: Router,
    private alertService : AlertService,
  ){}

  onToggleClick() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidebar.emit(this.isCollapsed);
  }

  onChatsClick(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/admin/chats']);

    if (!this.isCollapsed) {
      this.isCollapsed = true;
      this.toggleSidebar.emit(true);
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
    
  }

  logout(){
    const dialogRef = this.dialog.open(MessageDialogue, {
      data: {
        message: 'Do you want to logout ?',
        buttonText: {
          ok: 'Ok',
          cancel: 'Close'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        localStorage.clear();
        this.router.navigate(['/admin/login']);
        this.alertService.toast("success",true,"Logout Successfully");
      }
    });
  }
}
