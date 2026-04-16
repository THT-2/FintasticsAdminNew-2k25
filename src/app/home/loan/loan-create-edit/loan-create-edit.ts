import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';

import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators,} from '@angular/forms';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';

@Component({
  selector: 'app-loan-create-edit',
  imports: [Card, FormsModule, ReactiveFormsModule, FileUpload],
  templateUrl: './loan-create-edit.html',
  styleUrl: './loan-create-edit.scss',
  providers: [AlertService],
})
export class LoanCreateEdit implements OnInit{

  loanForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  categoryData: any;
  selectedimage: any;
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;

  constructor(
    private fb: FormBuilder,
    private navService: Data ,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute
  ) {
    this.acRouter.paramMap.subscribe((param) => {
      var id = String(param.get('id'));
      if(id != 'null'){
        this.getById(id);
      }
    });
  }
ngOnInit(): void {
  this.loanForm = this.fb.group({
    type: ['', Validators.required],
    icon: [null, Validators.required],
    _id: [null],
  });
}

  get loanFormControl() {
    return this.loanForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Loan_getbyId + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.categoryData = res.data;
        this.loanForm.patchValue({
          type: this.categoryData.type,
          icon: this.categoryData.icon,
          _id: this.categoryData._id,
        });
        this.editId = this.categoryData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

  submit() {
    if (this.loanForm.valid) {
      this.btnLoader = true;
      if (this.loanFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Loan_edit + "/" +  this.loanFormControl['_id'].value;
        this.navService.patchData(apiUrl, this.loanForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/loan']);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.message);
              this.btnLoader = false;
            }
          },
          error: (error: any) => {
            console.log(error);
            this.btnLoader = false;
          },
        });
      } else {
        let apiUrl =
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Loan_create;
          delete this.loanForm.value._id
        this.navService.postData(apiUrl, this.loanForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/loan']);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.message);
              this.btnLoader = false;
            }
          },
          error: (error: any) => {
            console.log(error);
            this.btnLoader = false;
          },
        });
      }
    } else {
      this.loanForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string) {
    this.loanFormControl['icon'].setValue(filePath);
  }

  removeImages(key:any) {
    if(key == "image") {
    this.loanForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.loanForm.patchValue({
      icon:''
    })
    }
  }
}
