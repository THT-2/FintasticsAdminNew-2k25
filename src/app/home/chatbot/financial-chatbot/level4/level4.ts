import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from '../../../../constants/alertservice';
import { Table } from '../../../../Z-Commons/table/table';
import { Card } from '../../../../Z-Commons/card/card';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { HeaderConstants } from '../../../../constants/header-constants';
import { Data } from '../../../../Service/data';
import { MessageDialogue } from '../../../../Z-Commons/message-dialogue/message-dialogue';

@Component({
  selector: 'app-level4',
  imports: [Card, Table],
  templateUrl: './level4.html',
  styleUrl: './level4.scss',
  providers:[AlertService]
})
export class Level4 {

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.financialbotchatgetlist;
  public loader: boolean = true;

  buttondata= {
    buttonName : 'Add New Level 4',
    routingPath : '/admin/level4/create',
    routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }

  tableData: any;
  columnDefinition: any[];

  constructor(private navService: Data , private router: Router,
    private alertService: AlertService, private cdr:ChangeDetectorRef,private dialog: MatDialog){
    this.columnDefinition = HeaderConstants.Level1Header;
  }

  ngOnInit(): void {
    this.getCategoryData();
  }


  getCategoryData(){
    this.loader = true;
    this.tableData = [];
   let data = {
      tableName:"Level4Schemachat"
    }
    this.navService.postData(this.apiUrl,data).subscribe({
      next:(res:any)=> {
        console.log(res);
        if (res.Code === 200){
          this.tableData = res.Data;
        }else {
          this.alertService.toast("error",true,res.Message);
        }
        this.loader=false;
        this.cdr.detectChanges();
      },error: (error:any) => {
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
      this.router.navigate(['/admin/level4/edit',event.data._id]);
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ApiRoutesConstants.financialbotchatdelete + '/' + event.data._id;
          this.navService.postData(apiUrl,{tableName:"Level4Schemachat"}).subscribe({
            next: (res: any) => {
              if (res['Status'] == 'Success') {
                this.alertService.toast("success",true,res.Message);
                this.getCategoryData();
              }

            },
            error: (error: any) => {
              console.log(error);
              if (error.error?.message) {
                // this.responseMessage = error.error.message;
              } else {
                // this.responseMessage = GlobalConstant.genericError;
              }
            }
          })

        }
      })
    }
  }
}
