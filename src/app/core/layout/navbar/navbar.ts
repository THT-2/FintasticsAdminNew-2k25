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
  @Output() toggleSidebar = new EventEmitter<void>();

  isDarkMode = false;

  get username(): string {
    return localStorage.getItem('username') || '';
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
    // console.log('[Navbar] permissions:', permissions);

    // Find the Fin Expert Chat parent (id: mainmenu)
    const finExpert = permissions.find((p: any) => p.id === 'mainmenu');
    if (!finExpert) {
      // console.log('[Navbar] No mainmenu in permissions');
      return false;
    }

    // parent checked (tolerant to true / "true" / 1)
    const parentChecked = isTrue(finExpert.checked);

    // check if "chats" submenu is checked
    let chatsChecked = false;
    if (Array.isArray(finExpert.subtitle)) {
      chatsChecked = finExpert.subtitle.some(
        (s: any) => s.id === 'chats' && isTrue(s.checked)
      );
    }

    const result = parentChecked || chatsChecked;
    // console.log('[Navbar] parentChecked:', parentChecked, 'chatsChecked:', chatsChecked, '=> canShowChatIcon:', result);

    return result;

  } catch (e) {
    console.error('[Navbar] Error parsing permissions from localStorage', e);
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
    this.toggleSidebar.emit();
  }

  onChatsClick(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/admin/chats']);

    if (!this.isCollapsed) {
      this.isCollapsed = true;
      this.toggleSidebar.emit();
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
