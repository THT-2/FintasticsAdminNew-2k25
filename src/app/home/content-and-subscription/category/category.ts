import { ChangeDetectorRef, Component } from '@angular/core';
import { Table } from "../../../Z-Commons/table/table";
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { Data } from '../../../Service/data';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderConstants } from '../../../constants/header-constants';
import { AlertService } from '../../../constants/alertservice';
import { GlobalConstant } from '../../../constants/global-constants';
import { MessageDialogue } from '../../../Z-Commons/message-dialogue/message-dialogue';
import { MatDialog } from '@angular/material/dialog';
import { Card } from "../../../Z-Commons/card/card";

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule, Table, Card],
  templateUrl: './category.html',
  styleUrl: './category.scss',
  providers:[AlertService]
})
export class Category implements OnInit{

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.desc_type_getlist;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New Category',
    routingPath : '/admin/category/create',
    routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  catData: any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private cdr: ChangeDetectorRef,private router: Router,private route :ActivatedRoute, private alertService: AlertService, private dialog: MatDialog){
    this.columnDefinition = HeaderConstants.descTypeListHeader;
  }
  ngOnInit(): void {
    this.getCategory();
  }
    getCategory(){
    this.loader = true;
    this.catData = [];
    this.navService.postData(this.apiUrl,this.catData).subscribe({
      next:(res:any)=> {
        console.log('Category',res);

        if (res.Code === 200) {
          this.catData = res.Data;
          this.buttondata = this.buttondata;
        }
        else {
          this.alertService.toast("error",true,res.Message);
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
      this.router.navigate(['/admin/category/edit',event.data._id]);
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.DESC_TYPE + ApiRoutesConstants.DELETE;
          this.navService.postData(apiUrl,{_id:event.data._id}).subscribe({
            next: (res: any) => {
              if (res['Status'] == 'Success') {
                this.alertService.toast("success",true,res.Message);
                this.getCategory();
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

      // dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      //     if (confirmed) {
      //       let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.DESC_TYPE + ApiRoutesConstants.DELETE + "/" + event.data._id;
      //       this.navService.deleterequestData(apiUrl,{_id:event.data._id}).subscribe({
      //       // let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.DESC_TYPE + ApiRoutesConstants.DELETE+ "/" + event.data._id;
      //       // this.navService.delete(apiUrl).subscribe({
      //         next: (res: any) => {
      //           if (res['Status'] == 'Success') {
      //             this.alertService.toast("success",true,res.message);
      //             this.getroledata();
      //           }
      //           window.location.reload();
      //         },
      //         error: (error: any) => {
      //           console.log(error);
      //           if (error.error?.message) {
      //             this.responseMessage = error.error.message;
      //           } else {
      //             this.responseMessage = GlobalConstant.genericError;
      //           }
      //         }
      //       })
      //     }
      //   })
    }
  }

}


