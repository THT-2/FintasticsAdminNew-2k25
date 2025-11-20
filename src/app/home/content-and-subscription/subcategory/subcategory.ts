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
  selector: 'app-subcategory',
  imports: [CommonModule, FormsModule, Table, Card],
  templateUrl: './subcategory.html',
  styleUrl: './subcategory.scss',
  providers:[AlertService]
})
export class Subcategory implements OnInit{

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.sub_desc_type_getlist;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New Sub-Category',
    routingPath : '/admin/subcategory/create',
    routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  subCategory: any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,private route :ActivatedRoute, private cdr: ChangeDetectorRef,private alertService: AlertService, private dialog: MatDialog){
    this.columnDefinition = HeaderConstants.SubdescTypeListHeader;
  }
  ngOnInit(): void {
    this.getsubcategory();
  }
    getsubcategory(){
    this.loader = true;
    this.subCategory = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log('subcat',res);

        if (res.Code === 200) {
          this.subCategory = res.Data;
          console.log('subcatdata',this.subCategory);
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
      this.router.navigate(['/admin/subcategory/edit',event.data._id]);
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.SUB_DESC_TYPE +ApiRoutesConstants.DELETE;
          this.navService.postData(apiUrl,{_id:event.data._id}).subscribe({
            next: (res: any) => {
              if (res['Status'] == 'Success') {
                this.alertService.toast("success",true,res.Message);
                this.getsubcategory();
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


