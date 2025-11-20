import { ChangeDetectorRef, Component } from '@angular/core';
import { Card } from "../../../Z-Commons/card/card";
import { Table } from "../../../Z-Commons/table/table";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { Data } from '../../../Service/data';
import { HeaderConstants } from '../../../constants/header-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { MessageDialogue } from '../../../Z-Commons/message-dialogue/message-dialogue';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-push',
  imports: [Card, Table,FormsModule,ReactiveFormsModule],
  templateUrl: './push.html',
  styleUrl: './push.scss',
  providers:[AlertService]
})
export class Push {

 public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.pushNotficationgetlist;
   public loader:boolean = true;
   buttondata= {
     buttonName : 'Add New Notfication',
     routingPath : '/admin/push/create',
     routingView : 'View',
     routingEdit : 'Edit',
     routingDelete : 'Delete',
     routingUpdateStatus:"Update",
     routingSendNow:"SendNow"
   }
   pushData: any;
   columnDefinition: any[];
   responseMessage: any;
  btnLoader: boolean = true;

   constructor(private navService: Data, private router: Router,private cdr:ChangeDetectorRef,
    private route :ActivatedRoute, private alertService: AlertService,private dialog: MatDialog){
     this.columnDefinition = HeaderConstants.pushnoticationListHeader;
   }

   ngOnInit(): void {
     this.getpushdata();
   }

   getpushdata(){
     this.loader = true;
     this.pushData = [];
     this.navService.getData(this.apiUrl).subscribe({
       next:(res:any)=> {
         console.log(res);

         if (res.Code === 200) {
           this.pushData = res.Data;
           this.buttondata = this.buttondata;
         }else {
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
       this.router.navigate(['/admin/push/edit',event.data._id]);
     }else if (event.actions === 'View'){
      this.router.navigate(['/admin/push/view',event.data._id]);
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
           let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.pushnotification_delete + event.data._id;
           this.navService.postData(apiUrl,{}).subscribe({
             next: (res: any) => {
               if (res['Status'] == 'Success') {
                 this.alertService.toast("success",true,res.Message);
                 this.getpushdata();
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
     }else if(event.actions === "Update"){
      let apiUrl =ApiRoutesConstants.BASE_URL + ApiRoutesConstants.pushNotficationedit + "/" + event.data._id;
        this.navService.postData(apiUrl, {Activestatus:event.data.Activestatus}).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.Message);
              this.btnLoader = false;
            }
          },
          error: (error: any) => {
            console.log(error);
            this.btnLoader = false;
          },
        });
     }else if(event.actions === "SendNow"){
      let apiUrl =ApiRoutesConstants.BASE_URL + ApiRoutesConstants.pushnotification_instant;
        this.navService.postData(apiUrl, {type:["Normal"],_id:event.data._id}).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.Message);
              this.btnLoader = false;
            }
          },
          error: (error: any) => {
            console.log(error);
            this.btnLoader = false;
          },
        });
     }
   }

}
