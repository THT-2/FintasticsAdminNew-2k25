import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Table } from '../../../Z-Commons/table/table';
import { Card } from '../../../Z-Commons/card/card';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { Data } from '../../../Service/data';
import { HeaderConstants } from '../../../constants/header-constants';
import { MessageDialogue } from '../../../Z-Commons/message-dialogue/message-dialogue';

@Component({
  selector: 'app-cart-category',
  imports: [Card, Table ],
  templateUrl: './cart-category.html',
  styleUrl: './cart-category.scss',
  providers:[AlertService]
})
export class CartCategory {

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.shoppingcartCategorygetlist;
  public loader: boolean = true;

  buttondata= {
    buttonName : 'Add New Category',
    routingPath : '/admin/cart-cat/create',
    routingView : 'View',
    routingEdit : 'Edit',
    routingdelete : 'Delete',
  }

  catData: any;
  columnDefinition: any[];

  constructor(private navService: Data , private router: Router, private cdr: ChangeDetectorRef,
    private alertService: AlertService, private dialog: MatDialog){
    this.columnDefinition = HeaderConstants.shoppingcartCategoryHeader;
  }

  ngOnInit(): void {
    this.getCategoryData()
  }


  getCategoryData(){
    this.loader = true;
    this.catData = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log(res);

        if (res.Code === 200){
          this.catData = res.Data;
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



  EdittableData(){

  }
  getActions(event:any){
    console.log("data",event);
    if (event.actions === 'Edit') {
      this.router.navigate(['/admin/cart-cat/edit',event.data._id]);
    }else if (event.actions === 'View'){
      // this.router.navigate(['/beta/clientView'], { queryParams: { id: event.data.clientId,type:"client" }, relativeTo: this.route });
    }else if (event.actions === 'Delete'){
      const dialogRef = this.dialog.open(MessageDialogue , {
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
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.shoppingcartCategory + ApiRoutesConstants.DELETE;
          this.navService.postData(apiUrl,{_id:event.data._id}).subscribe({
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
