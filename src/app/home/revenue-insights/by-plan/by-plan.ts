import { ChangeDetectorRef, Component } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';

@Component({
  selector: 'app-by-plan',
  imports: [NgFor,NgIf,DatePipe,RouterLink],
  templateUrl: './by-plan.html',
  styleUrl: './by-plan.scss',
  providers:[AlertService],
})
export class ByPlan {
  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.SubscriptionPlans;
plansdata: any;

constructor(private navService:Data,private alertService:AlertService, private cd:ChangeDetectorRef){}

    ngOnInit(): void {
    this.initPlanExports();
    this.getplantable();
  }

  private initPlanExports() {
    ['89', '499', '719'].forEach(plan => {
      document.getElementById(`export-${plan}`)?.addEventListener('click', () => {
        console.log(`Exporting subscribers of ₹${plan} plan`);
      });
    });
  }

  trackByIndex(i: number) {
     return i;
    }

    getplantable(){

    this.navService.postData(this.apiUrl,{}).subscribe({
    next: (res: any) => {
      console.log("plans",res);
      if (res.code === 200) {
        this.plansdata = res.data.plans;
        console.log('tablePlans', this.plansdata);
      } else {
        this.alertService.toast("error", true, res.message);
      }
      this.cd.detectChanges();
    },
    error: (error: any) => {
      this.alertService.toast("error", true, error);
    }
  });
    }
}
