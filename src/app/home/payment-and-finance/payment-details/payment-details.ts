import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from "../../../Z-Commons/card/card";
import { Table } from "../../../Z-Commons/table/table";
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { Data } from '../../../Service/data';
import { HeaderConstants } from '../../../constants/header-constants';

@Component({
  selector: 'app-payment-details',
  imports: [Card, Table,FormsModule,ReactiveFormsModule],
  templateUrl: './payment-details.html',
  styleUrl: './payment-details.scss',
  providers:[AlertService]
})
export class PaymentDetails {
buttondata= {
    buttonName : '',
    routingPath : '/admin/payment-details/create',
    // routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.User_list;
Datas: any;
  @Input() padding = 20;
  @Input() blockClass!: string;
  FilterData : any = ["Today","Yesterday","TenDays","Monthly","Quarterly","Yearly","Custom"]
    Form: FormGroup;
  filterFormvalue: any;
  columnDefinition: any[];

  constructor(private navService: Data , private router: Router, private alertService: AlertService,private fb: FormBuilder){
    this.columnDefinition = HeaderConstants.userListHeader;
     this.Form = this.fb.group({
          filterType: ['', Validators.required],
          startDate:[''],
          endDate:[''],
            });
  }


  ngOnInit(){
    this.filterFormvalue = "";
    this.Form.reset();
    this.getdetails();
  }
  filterChanges() {
    console.log('this.filterForm.value.filterType',this.Form.value.filterType);

   this.filterFormvalue = this.Form.value.filterType;
  }

  getdetails(){

    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log("details",res);
        if (res.Code === 200) {
          this.Datas = res.Data;
        }else {
          this.alertService.toast("error",true,res.Message);
        }
      },
      error: (error:any) => {
        console.log(error);
        this.alertService.toast("error",true,error);
      }
    })
  }
}
