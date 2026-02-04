import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '../../Service/data';
import { AlertService } from '../../constants/alertservice';
import { ApiRoutesConstants } from '../../constants/api-route-constants';
import { GlobalConstant } from '../../constants/global-constants';
import { HeaderConstants } from '../../constants/header-constants';
import { Card } from '../../Z-Commons/card/card';
import { MessageDialogue } from '../../Z-Commons/message-dialogue/message-dialogue';
import { Table } from '../../Z-Commons/table/table';

@Component({
  selector: 'app-ad-settings',
  imports: [CommonModule, FormsModule, Card, Table],
  templateUrl: './ad-settings.html',
  styleUrl: './ad-settings.scss',
  providers:[AlertService]
})
export class AdSettings implements OnInit{

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.ad_getlist;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New Ad',
    routingPath : '/admin/ad-settings/create',
    // routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  adsData: any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,private route :ActivatedRoute,
    private alertService: AlertService, private dialog: MatDialog, private cdr: ChangeDetectorRef){
    this.columnDefinition = HeaderConstants.AdsHeader;
  }
  ngOnInit(): void {
    this.getdata();
  }

  onStatusToggle(event: any) {
    console.log('event',event);
    
  const {field, value} = event;

  const id = event._id;

  const row = this.adsData.find((x: any) => x._id === id);
  if (row) row[field] = value; 

  const apiUrl =
    ApiRoutesConstants.BASE_URL + ApiRoutesConstants.adlist_edit + '/' + id;

  this.navService.postData(apiUrl, {
    id,
    active_status: value
  }).subscribe({
    
    error: () => {
      if (row) row[field] = !value; 
      this.alertService.toast('error', true, 'Status update failed');
    }
  });
}

    getdata(){
    this.loader = true;
    this.adsData = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log('roleres',res);

        if (res.code === 200) {
          // this.adsData = res.data;
          this.adsData = res.data.map((item: any) => ({
  ...item,
  android_active_status: !!item.android_active_status,
  ios_active_status: !!item.ios_active_status
}));
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
      this.router.navigate(['/admin/ad-settings/edit',event.data._id]);
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.adlist_delete;
          this.navService.postData(apiUrl,{_id:event.data._id}).subscribe({
            next: (res: any) => {
              if (res['status'] == 'Success') {
                this.alertService.toast("success",true,res.message);
                this.getdata();
              }
              // window.location.reload();
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


