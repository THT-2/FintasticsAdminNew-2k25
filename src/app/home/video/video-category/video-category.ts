import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { VideoCategoryCreateEdit } from "./video-category-create-edit/video-category-create-edit";
import { Card } from "../../../Z-Commons/card/card";
import { Table } from "../../../Z-Commons/table/table";
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { Data } from '../../../Service/data';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderConstants } from '../../../constants/header-constants';
import { MessageDialogue } from '../../../Z-Commons/message-dialogue/message-dialogue';
import { FormsModule } from '@angular/forms';
import { GlobalConstant } from '../../../constants/global-constants';

@Component({
  selector: 'app-video-category',
  imports: [VideoCategoryCreateEdit, Card, Table,CommonModule, FormsModule ],
  templateUrl: './video-category.html',
  styleUrl: './video-category.scss',
  providers:[AlertService]
})
export class VideoCategory implements OnInit{

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.video_category_getlist;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New Video Category',
    routingPath : '/admin/video/create',
    // routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }

  videoData: any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,private route :ActivatedRoute,private cdr: ChangeDetectorRef,
    private alertService: AlertService, private dialog: MatDialog){
    this.columnDefinition = HeaderConstants.VideosCategoryHeader;
  }
  ngOnInit(): void {
    this.getvideo();
  }
    getvideo(){
    this.loader = true;
    this.videoData = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log('video',res);

        if (res.code === 200) {
          this.videoData = res.data;
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
       this.navService.setUserId(event.data._id);
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.video_category_delete;
          this.navService.deleterequestData(apiUrl,{_id:event.data._id}).subscribe({

            next: (res: any) => {
              if (res.code===200) {
                this.alertService.toast("success",true,res.message);
                this.getvideo();
                this.cdr.detectChanges();
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

}


