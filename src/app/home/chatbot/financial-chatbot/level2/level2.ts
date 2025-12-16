import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { AlertService } from '../../../../constants/alertservice';
import { Card } from '../../../../Z-Commons/card/card';
import { Table } from '../../../../Z-Commons/table/table';
import { Data } from '../../../../Service/data';
import { HeaderConstants } from '../../../../constants/header-constants';
import { MessageDialogue } from '../../../../Z-Commons/message-dialogue/message-dialogue';

@Component({
  selector: 'app-level2',
  imports: [Card,Table],
  templateUrl: './level2.html',
  styleUrl: './level2.scss',
  providers:[AlertService]
})
export class Level2 {

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.financialbotchatgetlist;
  public loader: boolean = true;

  buttondata= {
    buttonName : 'Add New Level 2',
    routingPath : '/admin/level2/create',
    // routingView : 'View',
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
    this.getData();
  }


  getData(){
    this.loader = true;
    this.tableData = [];
   let data = {
      tableName:"level2Schemachat"
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
      this.router.navigate(['/admin/level2/edit',event.data._id]);
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.financialbotchatdelete + '/' + event.data._id;
          this.navService.postData(apiUrl,{tableName:"level2Schemachat"}).subscribe({
            next: (res: any) => {
              if (res['Status'] == 'Success') {
                this.alertService.toast("success",true,res.Message);
                this.getData();
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
