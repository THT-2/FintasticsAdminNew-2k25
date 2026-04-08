import { Component  } from '@angular/core';

import { UserSidebar } from "./user-sidebar/user-sidebar";
import { UserMainArea } from "./user-main-area/user-main-area";
import { MaterialModule } from "../../../Z-Commons/material-module";



@Component({
  selector: 'app-user-360-view-dashboard',
  imports: [
    UserSidebar,
    UserMainArea,
    MaterialModule
],
  templateUrl: './user-360-view-dashboard.html',
  styleUrl: './user-360-view-dashboard.scss'
})
export class User360ViewDashboard {
  sidebarOpened = true;
  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }
}
