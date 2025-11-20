import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { HeaderConstants } from '../../../constants/header-constants';
import { Card } from '../../../Z-Commons/card/card';

@Component({
  selector: 'app-details-create-edit',
  imports: [FormsModule,
    ReactiveFormsModule,
    Card,NgIf],
  templateUrl: './details-create-edit.html',
  styleUrl: './details-create-edit.scss',
  providers: [AlertService]
})
export class DetailsCreateEdit {

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.Roles_Type;
  userForm: FormGroup;
  columnDefinition: any[];
  userData: any;
   public btnLoader:boolean = false;

  constructor(private navService: Data , private router: Router,
     private alertService: AlertService,private fb: FormBuilder,
    private cd: ChangeDetectorRef){
    this.columnDefinition = HeaderConstants.roleListHeader;
    this.userForm = this.fb.group({
      userRole: ['', Validators.required],
      userName:['',Validators.required],
      userID:['',Validators.required],
      userMail:['',Validators.required],
      PassWord:['',Validators.required],
      _id:[null]
    });
  }

  get userFormControl() {
    return this.userForm.controls
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getuserdata()
  }

  getuserdata(){

    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log('details',res);

        if (res.code === 200) {
          this.userData = res.data;
        }else {
          this.alertService.toast("error",true,res.message);
        }
        this.cd.detectChanges();
      },
      error: (error:any) => {
        console.log(error);
        this.alertService.toast("error",true,error);
      }
    })
  }
  submit() {
    console.log("total_amount",this.userForm);

    if (this.userForm.valid) {
      if(this.userFormControl['_id'].value) {
        let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.user_edit + '/' + this.userFormControl['_id'].value;
      this.navService.postData(apiUrl,this.userForm.value).subscribe({
        next:(res:any)=> {
          if (res.code === 200) {
            this.alertService.toast("success",true,res.message);
           this.router.navigate(['/admin/user-details']);
          }else {
            this.alertService.toast("error",true,res.Message);
          }
        },
        error: (error:any) => {
          console.log(error);
        }
      })
      } else {
        delete this.userForm.value._id
        let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.admin_create;
        this.navService.postData(apiUrl,this.userForm.value).subscribe({
          next:(res:any)=> {
            console.log("res",res);

            if (res.Code === 200) {
             this.alertService.toast("success",true,res.Message);
             this.router.navigate(['/admin/user-details']);
            }else {
              this.alertService.toast("error",true,res.Message);
            }
          },
          error: (error:any) => {
            console.log(error);
          }
        })
      }

    } else {
      this.userForm.markAllAsTouched();
    }
  }


}
