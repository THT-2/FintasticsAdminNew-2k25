import { ChangeDetectorRef, Component } from '@angular/core';

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
  selector: 'app-loan',
  imports: [FormsModule, Card, Table],
  templateUrl: './loan.html',
  styleUrl: './loan.scss',
  providers:[AlertService]
})
export class Loan implements OnInit{

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.Loan_getlist;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New',
    routingPath : '/admin/loan/create',
    // routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  loan: any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,private route :ActivatedRoute,
    private alertService: AlertService, private dialog: MatDialog, private cdr: ChangeDetectorRef){
    this.columnDefinition = HeaderConstants.LoansHeader;
  }
  ngOnInit(): void {
    this.getloan();
  }
    getloan(){
    this.loader = true;
    this.loan = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log('loan',res);

        if (res.code === 200) {
          this.loan = res.data;
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
      this.router.navigate(['/admin/loan/edit',event.data._id]);
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.Loan_delete+'/'+event.data._id;
          this.navService.delete(apiUrl).subscribe({
            next: (res: any) => {
              if (res.code == 200) {
                this.alertService.toast("success",true,res.message);
                this.getloan();
              }
              this.cdr.detectChanges();
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


