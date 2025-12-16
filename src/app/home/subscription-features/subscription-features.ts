import { Component } from '@angular/core';
import { Card } from "../../Z-Commons/card/card";
import { Table } from "../../Z-Commons/table/table";
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../constants/alertservice';
import { ApiRoutesConstants } from '../../constants/api-route-constants';
import { Data } from '../../Service/data';
import { GlobalConstant } from '../../constants/global-constants';
import { HeaderConstants } from '../../constants/header-constants';
import { MessageDialogue } from '../../Z-Commons/message-dialogue/message-dialogue';


@Component({
  selector: 'app-subscription-features',
  imports: [Card, Table,CommonModule, FormsModule,],
  templateUrl: './subscription-features.html',
  styleUrl: './subscription-features.scss',
  providers:[AlertService]
})

export class SubscriptionFeatures implements OnInit{

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.features_getlist;
  public url = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.benefits_getlist;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New Features',
    routingPath : '/admin/features/create',
    // routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  benefitButton= {
    buttonName : 'Add New Benefit Banner',
    routingPath : '/admin/features/benefits/create',
    routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }

  features: any;
  plans:any;
  benefits:any;
  columnDefinition: any[];
  benifitscolumn: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,
    private cdr: ChangeDetectorRef,private route :ActivatedRoute, private alertService: AlertService, private dialog: MatDialog){
    this.columnDefinition = HeaderConstants.SubscriptionFeaturesHeader;
    this.benifitscolumn = HeaderConstants.BenefitsBannerHeader;
  }

  ngOnInit(): void {
    this.getfeatures();
    this.getbenefits();
  }


  getbenefits(){
    this.loader = true;
    this.benefits = [];
    this.navService.getData(this.url).subscribe({
      next:(res:any)=> {
        console.log('benbanner',res);

        if (res.code === 200) {
          this.benefits = res.data;
          this.benefitButton = this.benefitButton;
        }
        else {
          this.alertService.toast("error",true,res.message);
        }
        this.loader=false;
        this.cdr.detectChanges();
      },
      error: (error:any) => {
        console.log(error);
        this.alertService.toast("error",true,error);
      },
      complete: () => {
        this.loader = false;
      }
    })
  }

getfeatures() {
  this.loader = true;

  this.navService.getData(this.apiUrl).subscribe({
    next: (res: any) => {
      if (res.code === 200) {
        this.plans = res.subscription_plan || [];

        const statusCols = this.plans.map((p: any) => ({
          name: p._id ,
          displayName: p.title,
          type: 'status' as const,
        }));

        const titleCol   = { name: 'title',  displayName: 'Title',  disableSorting: false, class: 'text-transform' };
        // const iconCol    = { name: 'icon',   displayName: 'Icon',   disableSorting: false, class: 'text-transform' };
        const actionsCol = { name: 'actions',displayName: 'Action', disableSorting: false };


        this.columnDefinition = [titleCol, ...statusCols, actionsCol];


        this.features = (res?.data || []).map((row: any) => ({
          ...row,
          subsById: Object.fromEntries(
            (row.subscription_available || []).map((s: any) => [s.subscription_id, { ...s }])
          ),
        }));
        this.loader=false;
        this.cdr.detectChanges();
      } else {
        this.alertService.toast('error', true, res.message);
      }
      this.loader = false;
    },
    error: (err: any) => {
      console.error(err);
      this.alertService.toast('error', true, err);
      this.loader = false;
    },
    complete: () => (this.loader = false)
  });
}

onPlanStatusChange(event: { featureId: string; subscriptionId: string; status: string }) {
  const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.features_update;
  const payload = {
    featured_id: event.featureId,
    subscription_id: event.subscriptionId,
    status: event.status
  };

  this.navService.postData(apiUrl, payload).subscribe({
    next: (res: any) => {
      if (res.code === 200 || res.status === true) {
        this.alertService.toast('success', true, 'Status updated successfully');
        this.getfeatures();
      } else {
        this.alertService.toast('error', true, res.message || 'Update failed');
      }
    },
    error: (err: any) => {
      console.error('Error updating status:', err);
      this.alertService.toast('error', true, 'Something went wrong while updating');
    }
  });
}

    getActions(event:any){
    console.log("data",event);
    if (event.actions === 'Edit'){
      this.router.navigate(['/admin/features/edit',event.data._id]);
    }else if (event.actions === 'View'){
      this.router.navigate(['/beta/clientView'], { queryParams: { id: event.data.clientId,type:"client" }, relativeTo: this.route });
    }else if (event.actions === 'Delete'){
      const dialogRef = this.dialog.open(MessageDialogue, {
        data: {
          message: 'Do you want to delete this Event ?',
          buttonText: {
            ok: 'Ok',
            cancel: 'Close'
          }
        }
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.features_delete +'/' + event.data._id;
          this.navService.postData(apiUrl,{}).subscribe({
            next: (res: any) => {
              if (res['status'] == true) {
                this.alertService.toast("success",true,res.message);
                this.getfeatures();
              }
            },
            error: (error: any) => {
              console.log(error);
              if (error.error?.message) {
                this.responseMessage = error.error.message;
              } else {
                this.responseMessage = GlobalConstant.genericError;
              }
            }
          })
        }
      })
    }
  }
    getBenefitsActions(event:any){
    console.log("data",event);
    if (event.actions === 'Edit'){
      this.router.navigate(['/admin/features/benefits/edit',event.data._id]);
    }else if (event.actions === 'View'){
      this.router.navigate(['/beta/clientView'], { queryParams: { id: event.data.clientId,type:"client" }, relativeTo: this.route });
    }else if (event.actions === 'Delete'){
      const dialogRef = this.dialog.open(MessageDialogue, {
        data: {
          message: 'Do you want to delete this Event ?',
          buttonText: {
            ok: 'Ok',
            cancel: 'Close'
          }
        }
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.benefits_delete +'/' + event.data._id;
          this.navService.getData(apiUrl).subscribe({
            next: (res: any) => {
              if (res['status'] == true) {
                this.alertService.toast("success",true,res.message);
                this.getbenefits();
              }
              this.cdr.detectChanges();
            },
            error: (error: any) => {
              console.log(error);
              if (error.error?.message) {
                this.responseMessage = error.error.message;
              } else {
                this.responseMessage = GlobalConstant.genericError;
              }
            }
          })
        }
      })
    }
  }
}


