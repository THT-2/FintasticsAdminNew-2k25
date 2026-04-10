import { Component } from '@angular/core';
import { Table } from "../../Z-Commons/table/table";
import { Card } from "../../Z-Commons/card/card";
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiRoutesConstants } from '../../constants/api-route-constants';
import { AlertService } from '../../constants/alertservice';
import { GlobalConstant } from '../../constants/global-constants';
import { HeaderConstants } from '../../constants/header-constants';
import { MessageDialogue } from '../../Z-Commons/message-dialogue/message-dialogue';
import { Data } from '../../Service/data';


@Component({
  selector: 'app-subscription-rewards',
  imports: [Card, Table],
  templateUrl: './subscription-rewards.html',
  styleUrl: './subscription-rewards.scss',
  providers:[AlertService]
})
export class SubscriptionRewards implements OnInit{

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.rewards_getlist;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add Reward',
    routingPath : '/admin/subs-rewards/create',
    // routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  rewardData: any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,private route :ActivatedRoute,
    private alertService: AlertService, private dialog: MatDialog, private cdr: ChangeDetectorRef){
    this.columnDefinition = HeaderConstants.SubscriptionRewardsHeader;
  }
  ngOnInit(): void {
    this.getreward();
  }

    getreward(){
    this.loader = true;
    this.rewardData = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log('refund',res);
        if (res.code === 200) {
          this.rewardData = res.data;
          console.log('refund2',this.rewardData);
          this.buttondata = this.buttondata;
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

    getActions(event:any){
    console.log("data",event);
    if (event.actions === 'Edit') {
      this.router.navigate(['/admin/subs-rewards/edit',event.data._id]);
    }else if (event.actions === 'View'){
      // this.router.navigate(['/beta/clientView'], { queryParams: { id: event.data.clientId,type:"client" }, relativeTo: this.route });
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
          let apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.rewards_delete + "/" + event.data._id;
          this.navService.delete(apiUrl).subscribe({
            next: (res: any) => {
              if (res['status'] == true) {
                this.alertService.toast("success",true,res.message);
                this.getreward();
              }
              window.location.reload();
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


