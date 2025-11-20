import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selector: 'app-role',
  imports: [CommonModule, FormsModule, Table, Card],
  templateUrl: './role.html',
  styleUrl: './role.scss',
  providers:[AlertService]
})
export class Role implements OnInit{
   public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.Roles_Type;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New Role',
    routingPath : '/admin/roles/create',
    routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  roleData: any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,private route :ActivatedRoute,
    private cdr: ChangeDetectorRef, private alertService: AlertService, private dialog: MatDialog){
    this.columnDefinition = HeaderConstants.roleListHeader;
  }
  ngOnInit(): void {
    this.getroledata();
  }

    getroledata(){
    this.loader = true;
    this.roleData = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log('roleres',res);

        if (res.code === 200) {
          this.roleData = res.data;
          console.log("uproleData",this.roleData);
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
      this.router.navigate(['/admin/roles/edit',event.data._id]);
    }else if (event.actions === 'View'){
      this.router.navigate(['/admin/roles/edit',event.data._id]);
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.Roles_delete + event.data._id;
          this.navService.postData(apiUrl,{}).subscribe({
            next: (res: any) => {
              if (res['status'] == true) {
                this.alertService.toast("success",true,res.message);
                this.getroledata();
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


