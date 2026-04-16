import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { UserSidebar } from "./user-sidebar/user-sidebar";
import { UserMainArea } from "./user-main-area/user-main-area";
import { MaterialModule } from "../../../Z-Commons/material-module";
import { Data } from '../../../Service/data';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { ActivatedRoute } from '@angular/router';


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
export class User360ViewDashboard implements OnInit {

  public apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.userview_overall;

  sidebarOpened = true;
  
  
  id:any;

  moduleTrackingData: any[] = [];
  transectionscount: any[] = [];
  categoryBreakdown: any[] = [];
  passbookData: any[] =[];
  goaldashboard_data: any[] =[];
  reminders: any[] =[];
  categorySummary: any[] = [];
  dashboard_data: any;
  deviceDetails:any;
  rewardpoints: any;
  
  constructor(
  private navService: Data,
  private route: ActivatedRoute,
  private zone: NgZone,
  private cdr: ChangeDetectorRef
) {}


 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.id = params.get('id');
    this.getModuleTracking();
  });
}

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

getModuleTracking() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const url = `${ApiRoutesConstants.BASE_URL}adminPanel/user360_Dashboard/${this.id}?budgetYear=${year}&budgetMonth=${month}&apitype=admin`;

  this.navService.getData(url).subscribe({
    next: (res: any) => {
      const result = res?.result || {};

      this.zone.run(() => {
        this.moduleTrackingData = [...(result.modulestrackings || [])];
        this.transectionscount = [...(result.transectionscount || [])];
        this.categoryBreakdown = [
          ...(result.dashboard_data?.budgetOverview?.categoryBreakdown || [])
        ];
        this.passbookData = [...(result.dashboard_data?.passbookData || [])];
        this.goaldashboard_data = result.goaldashboard_data || {};
        this.categorySummary = [
          ...(result.transactions?.homescreenDatasAll?.categorysummary || [])
        ];
        this.reminders = [...(result.dashboard_data?.reminders || [])];
        this.rewardpoints = result.dashboard_data?.user?.rewardpoints || 0;
        this.dashboard_data = { ...(result.dashboard_data || {}) };
        this.deviceDetails = { ...(result.deviceDetails || {}) };

        console.log('dashboard_data:', result);

        // 🔥 this is the important part
        this.cdr.detectChanges();
      });
    },
    error: (err) => {
      console.error('Dashboard API failed', err);
    }
  });
}
}