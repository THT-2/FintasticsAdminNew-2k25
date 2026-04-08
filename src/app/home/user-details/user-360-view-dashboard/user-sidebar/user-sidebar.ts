import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { Data } from '../../../../Service/data';
import { AlertService } from '../../../../constants/alertservice';

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
  styleUrl: './user-sidebar.scss',
  providers:[AlertService]
})
export class UserSidebar {

public apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.userview_overall;
userData: any;
subscription: any;
  sidebarOpened = true;
  @Input() trackingData: any[] = [];

  constructor(private navService: Data, 
    private alertService: AlertService,private cdr: ChangeDetectorRef,
  private route:ActivatedRoute){
  }
  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  id: any;

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.id = params.get('id');   
    console.log('Route ID:', this.id);

    this.getdata(); 
  });
}

getdata() {
  this.userData = {};

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const url = `${ApiRoutesConstants.BASE_URL}adminPanel/user360_Dashboard/${this.id}?budgetYear=${year}&budgetMonth=${month}&apitype=admin`;

  this.navService.getData(url).subscribe({
    next: (res: any) => {
      console.log('API response:', res);

      if (res.code === 200) {
        this.userData = res.result.dashboard_data;
        // this.modules = res.result.modulestrackings;
        // this.transactions = res.result.transactions;
      } else {
        this.alertService.toast("error", true, res.message);
      }

      this.cdr.detectChanges();
    },
    error: (error: any) => {
      console.log(error);
      this.alertService.toast("error", true, error);
    }
  });
}

}
