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
  selector: 'app-app-banner',
  imports: [Table, Card],
  templateUrl: './app-banner.html',
  styleUrl: './app-banner.scss',
  providers:[AlertService]
})
export class AppBanner implements OnInit{

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.Banners_getlist;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New Banner',
    routingPath : '/admin/banners/create',
    // routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  bannerData: any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,private route :ActivatedRoute,
    private alertService: AlertService, private dialog: MatDialog, private cdr: ChangeDetectorRef){
    this.columnDefinition = HeaderConstants.BannersHeader;
  }
  ngOnInit(): void {
    this.getdata();
  }
    getdata(){
    this.loader = true;
    this.bannerData = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log('banner',res);

        if (res.code === 200) {
          this.bannerData = res.data;
          console.log('banner2',this.bannerData);
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
      this.router.navigate(['/admin/banners/edit',event.data._id]);
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.Banners_delete+"/"+event.data._id;
          this.navService.postData(apiUrl,{}).subscribe({
            next: (res: any) => {
              if (res['status'] == true) {
                this.alertService.toast("success",true,res.message);
                this.getdata();
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


