import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../constants/alertservice';
import { MessageDialogue } from '../../../Z-Commons/message-dialogue/message-dialogue';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HomeRoutingModule } from "../../../home/home-routing-module";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HomeRoutingModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  providers:[AlertService]
})
export class Navbar {
  @Input() isCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  isDarkMode = false;

  constructor(private dialog:MatDialog,private renderer: Renderer2,
    private router: Router, private alertService : AlertService,){}


  onToggleClick() {
    console.log('toggle click');
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidebar.emit();

  }

   toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      console.log('Dark mode ON');
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      console.log('Dark mode OFF');
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }
    logout(){
      console.log('logout click');

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
    })
  }

}
