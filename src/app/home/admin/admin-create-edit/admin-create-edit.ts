import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';

@Component({
  selector: 'app-admin-create-edit',
  imports: [FormsModule, CommonModule,ReactiveFormsModule, Card],
  templateUrl: './admin-create-edit.html',
  styleUrl: './admin-create-edit.scss',
  providers: [AlertService]
})
export class AdminCreateEdit  {

public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.Roles_Type;
  userForm!: FormGroup;
  adminData: any;
  pageLoader!: boolean;
  userData: any;
  editId: any;
  GlobalConstant: any = GlobalConstant;

  constructor(private navService: Data ,
    private router: Router,
    private acRouter: ActivatedRoute,
    private alertService: AlertService,
    private fb: FormBuilder,
  private cd: ChangeDetectorRef)
    {
    this.acRouter.paramMap.subscribe((param) => {
      var id = String(param.get('id'));
      console.log('id', id);
      if(id != 'null'){
        console.log('id', id);
        this.getById(id);
      }
    });
  }

  get userFormControl() {
    return this.userForm.controls
  }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      userRole: ['', Validators.required],
      userName:['',Validators.required],
      userID:['',Validators.required],
      userMail:['',Validators.required],
      PassWord:['',Validators.required],
      _id:[null]
    });
    this.getadmindata();
  }

  getadmindata() {
  this.navService.getData(this.apiUrl).subscribe({
    next: (res: any) => {
      if (res.code === 200) {
        this.adminData = res.data;
        console.log('roleData', this.adminData);

        if (this.userData) {
          this.userForm.patchValue({
            userRole: this.userData.userRole,
          });
        }
        this.cd.detectChanges();
      } else {
        this.alertService.toast("error", true, res.message);
      }
    },
    error: (error: any) => {
      this.alertService.toast("error", true, error);
    }
  });
}
  getById(id: any) {
    console.log("getid", id);
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.admin_getlist_id + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log('getbyid',res);
        console.log('id_data',res.data);
        this.userData = res.data;
        this.userForm.patchValue({
          userRole: this.userData.userRole,
          userName: this.userData.userName,
          userID: this.userData.userID,
          userMail: this.userData.userMail,
          PassWord: this.userData.PassWord,
          _id: this.userData._id,
        });
        this.editId = this.userData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      }

    });
  }

  submit() {
    console.log("total_amount",this.userForm);

    if (this.userForm.valid) {
      if(this.userFormControl['_id'].value) {
        let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.admin_edit ;
      this.navService.postData(apiUrl,this.userForm.value).subscribe({
        next:(res:any)=> {
          console.log("edituser",res);
          if (res.code === 200) {
            this.alertService.toast("success",true,res.message);
           this.router.navigate(['/admin/adminuser']);
          }else {
            this.alertService.toast("error",true,res.message);

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
            if (res.code === 200) {
             this.alertService.toast("success",true,res.message);
             this.router.navigate(['/admin/adminuser']);
            }else {
              this.alertService.toast("error",true,res.message);
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
