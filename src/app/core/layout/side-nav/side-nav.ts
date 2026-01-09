import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Data } from '../../../Service/data';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { HomeRoutingModule } from "../../../home/home-routing-module";

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, HomeRoutingModule],
  templateUrl: './side-nav.html',
  styleUrls: ['./side-nav.scss']
})
export class SideNav implements OnInit {
  @Input() isCollapsed: boolean = false;

  NavItems: any[] = [];
  pageLoader = false;
  GlobalConstant: any = GlobalConstant;

  constructor(private navService: Data, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPermissions();

  }

  toggleSection(section: any) {
    this.NavItems.forEach(nav => {
      nav.open = nav === section ? !nav.open : false;
    });
  }

  loadPermissions() {
    const roleId = localStorage.getItem('role');
    if (!roleId) {
      this.NavItems = [];
      return;
    }

    this.pageLoader = true;
    const apiUrl =
      ApiRoutesConstants.BASE_URL +
      ApiRoutesConstants.Roles_get_id +
      roleId;

    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        if (res?.code === 200 && res?.data?.permissions) {

  const permissions = res.data.permissions;



  const mainMenu = permissions.find((p: any) => p.id === 'mainmenu');
  if (mainMenu) {

    const anyChildChecked =
      Array.isArray(mainMenu.subtitle) &&
      mainMenu.subtitle.some(
        (s: any) =>
          s.checked === true || s.checked === 1 || s.checked === '1'
      );

    if (anyChildChecked) {
      mainMenu.checked = true; // parent enforced
    }
  }

  // NOW save corrected permissions
  localStorage.setItem(
    'permissions',
    JSON.stringify(permissions)
  );

  this.NavItems = permissions
    .map((nav: any, index: number) => ({
      ...nav,
      open: index === 0,
      subtitle: (nav.subtitle || []).filter(
        (sub: any) =>
          sub?.checked === true ||
          sub?.checked === 1 ||
          sub?.checked === '1'
      )
    }))
    .filter((nav: any) => nav.subtitle.length > 0);
}

        else {
          this.NavItems = [];
        }

        this.pageLoader = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.pageLoader = false;
        this.NavItems = [];
      }
    });
    // console.log("SideNav loaded NavItems:", this.NavItems);
  }
}
