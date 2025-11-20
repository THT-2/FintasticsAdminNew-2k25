import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';

@Component({
  selector: 'app-by-platform',
  // standalone: true,
  imports: [DatePipe, CommonModule, NgFor, NgIf, RouterLink],
  templateUrl: './by-platform.html',
  styleUrl: './by-platform.scss',
  providers:[AlertService]
})
export class ByPlatform {

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.SubscriptionPlans;
  platform: any;

  constructor(private navService:Data, private alertService:AlertService,
    private cd:ChangeDetectorRef
  ){
  }
    ngOnInit(): void {
    this.initPlatformExports();
    this.getPlatform();
  }

  private initPlatformExports() {
    ['ios', 'android'].forEach(platform => {
      document.getElementById(`export-${platform}`)?.addEventListener('click', () => {
        console.log(`Exporting ${platform.toUpperCase()} subscribers`);
      });
    });
  }

  getPlatform(){
    this.navService.postData(this.apiUrl,{}).subscribe({
    next: (res: any) => {
      console.log("platform",res);
      if (res.code === 200) {
        this.platform = res.data.platformsRaw;
        console.log('platformdata', this.platform);
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
    trackByIndex(i: number) {
     return i;
    }
}
