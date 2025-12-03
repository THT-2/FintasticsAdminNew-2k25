import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IsActiveMatchOptions, Router, RouterLink } from '@angular/router';
import { Data } from '../../../Service/data';
import { HttpClientModule } from '@angular/common/http';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { HomeRoutingModule } from "../../../home/home-routing-module";

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, CommonModule, HttpClientModule, HomeRoutingModule],
  templateUrl: './side-nav.html',
  styleUrls: ['./side-nav.scss']
})
export class SideNav implements OnInit {

  @Input() isCollapsed: boolean = false;

  NavItems: any[] = [];
  pageLoader: boolean = false;
  GlobalConstant: any = GlobalConstant;
  showChatsScreen: boolean = false;
  newkey:any

  constructor(private navService: Data, private cd: ChangeDetectorRef,private router: Router) {}

   hasActiveChild(item: any): boolean {
    if (!item?.children?.length) return false;

    const matchOpts: IsActiveMatchOptions = {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    };

    return item.children.some((c: any) =>
      this.router.isActive(this.router.createUrlTree([c.url]), matchOpts)
    );
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

  toggleDropdown(item: any) {
    item.open = !item.open;
  }

 loadPermissions() {
    const roleId = localStorage.getItem('role');

    if (!roleId) {
      console.error("No roleId found in localStorage");
      this.NavItems = [];
      return;
    }

    this.pageLoader = true;
    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Roles_get_id + roleId;

    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.data) {
          this.NavItems = (res.data.permissions || [])
            .map((item: any) => ({
              ...item,
              subtitle: (item.subtitle || []).filter((sub: any) => sub.checked)
            }))
            .filter((item: any) => item.subtitle.length > 0);

          this.newkey = this.NavItems[4].subtitle[2].id;


          this.showChatsScreen = this.newkey === 'chats';

          console.log("SideNav loaded NavItems:", this.NavItems);
          
          this.cd.detectChanges();
        }
        this.pageLoader = false;
      },
      error: (err: any) => {
        console.error("Error fetching role permissions:", err);
        this.pageLoader = false;
      }
    });
  }
}


// import { CommonModule } from '@angular/common';
// import { Component, Input, OnInit } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';

// import { Data } from '../../../Service/data';
// import { ApiRoutesConstants } from '../../../constants/api-route-constants';
// import { GlobalConstant } from '../../../constants/global-constants';
// import { HomeRoutingModule } from "../../../home/home-routing-module";

// @Component({
//   selector: 'app-side-nav',
//   standalone: true,
//   imports: [CommonModule, RouterLink, HttpClientModule, HomeRoutingModule],
//   templateUrl: './side-nav.html',
//   styleUrls: ['./side-nav.scss']
// })
// export class SideNav implements OnInit {
//   @Input() isCollapsed: boolean = false;

//   NavItems: any[] = [];
//   pageLoader = false;
//   GlobalConstant: any = GlobalConstant;

//   constructor(private navService: Data) {}

//   ngOnInit(): void {
//     this.loadPermissions();
//   }


//   toggleSection(section: any) {
//     section.open = !section.open;
//   }


//   loadPermissions() {
//     const roleId = localStorage.getItem('role');
//     if (!roleId) {
//       this.NavItems = [];
//       return;
//     }

//     this.pageLoader = true;
//     const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Roles_get_id + roleId;

//     this.navService.getData(apiUrl).subscribe({
//       next: (res: any) => {
//         if (res?.code === 200 && res?.data?.permissions) {
//           this.NavItems = res.data.permissions
//             .map((nav: any, index: number) => ({
//               ...nav,
//               open: index === 0,
//               subtitle: (nav.subtitle || []).filter((sub: any) => sub?.checked)
//             }))
//             .filter((nav: any) => nav.subtitle.length > 0);
//         } else {
//           this.NavItems = [];
//         }
//         this.pageLoader = false;
//       },
//       error: () => {
//         this.pageLoader = false;
//         this.NavItems = [];
//       }
//     });
//   }
// }
