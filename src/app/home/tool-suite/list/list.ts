import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { Data } from '../../../Service/data';
import { HeaderConstants } from '../../../constants/header-constants';
import { MessageDialogue } from '../../../Z-Commons/message-dialogue/message-dialogue';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from "../../../Z-Commons/card/card";
import { Table } from "../../../Z-Commons/table/table";


@Component({
  selector: 'app-list',
  imports: [Card, Table],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  providers: [AlertService]
})
export class List {

public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.ToolsSuites_getlistAll;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New Tool',
    routingPath : '/admin/list/create',
    // routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  toolData: any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,private cdr: ChangeDetectorRef,
    private route :ActivatedRoute, private alertService: AlertService,private dialog: MatDialog){
    this.columnDefinition = HeaderConstants.toolListHeader;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.gettooldata();
  }


  gettooldata(){
    this.loader = true;
    this.toolData = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log(res);
        if (res.Code === 200) {
          this.toolData = res.Data;
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
      this.router.navigate(['/admin/list/edit',event.data._id]);
    }else if (event.actions === 'View'){
      this.router.navigate(['/beta/suites/edit'], { queryParams: { id: event.data._id }, relativeTo: this.route });
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.tools_delete;
          this.navService.postData(apiUrl,{_id:event.data._id}).subscribe({
            next: (res: any) => {
              if (res['Status'] == 'Success') {
                this.alertService.toast("success",true,res.Message);
                this.gettooldata();
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
