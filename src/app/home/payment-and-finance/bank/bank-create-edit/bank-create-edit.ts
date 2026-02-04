import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Card } from '../../../../Z-Commons/card/card';
import { FileUpload } from '../../../../Z-Commons/file-upload/file-upload';
import { AlertService } from '../../../../constants/alertservice';
import { GlobalConstant } from '../../../../constants/global-constants';
import { Data } from '../../../../Service/data';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';

@Component({
  selector: 'app-bank-create-edit',
  imports: [ Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload ,
    // FilePreview,
    NgIf
  ],
  templateUrl: './bank-create-edit.html',
  styleUrl: './bank-create-edit.scss',
  providers:[AlertService]
})
export class BankCreateEdit {
  BankForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  BankData: any;
  selectedimage: any;
  smsCodeInput: string = '';
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;

  constructor(
    private fb: FormBuilder,
    private navService: Data,
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
  this.BankForm = this.fb.group({
    bankName: ['', Validators.required],
    icon: [null, Validators.required],
    backgroundcolor: ['', Validators.required],
    banksmsCode: [[], Validators.required],
    _id: [null],
  });
}

  get BankFormControl() {
    return this.BankForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.bankgetlist_id + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.BankData = res.Data;
        this.BankForm.patchValue({
          bankName: this.BankData.bankName,
          icon: this.BankData.icon,
          backgroundcolor: this.BankData.backgroundcolor,
          banksmsCode: this.BankData.banksmsCode || [], 
          _id: this.BankData._id,
        });
        this.editId = this.BankData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

  submit() {
    if (this.BankForm.valid) {
      this.btnLoader = true;
      if (this.BankFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.bankedit + "/" + this.BankFormControl['_id'].value;
        this.navService.postData(apiUrl, this.BankForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/bank']);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.Message);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.bankcreate;
          delete this.BankForm.value._id
        this.navService.postData(apiUrl, this.BankForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/bank']);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.Message);
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
      this.BankForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string) {
    this.BankFormControl['icon'].setValue(filePath);
  }

    fileuploadAnyProof(event: any,key:any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedimage = event.target.files;
      const fd = new FormData();
        fd.append('sampleFile', this.selectedimage[0]);
        let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.uploadfile;
      this.navService.postData(apiUrl,fd).subscribe((res: any) => {

        if (key == "image") {
          this.BankForm.patchValue({
            image:res.Data
          })
        }else if(key == "icon"){
          this.BankForm.patchValue({
            icon:res.Data
          })
        }
      });

    } else {
      console.error("No files selected.");
    }
  }

  

  removeImages(key:any) {
    if(key == "image") {
    this.BankForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.BankForm.patchValue({
      icon:''
    })
    }
  }


  addSmsCode() {
  const value = this.smsCodeInput.trim();
  if (!value) return;

  const tags = this.BankFormControl['banksmsCode'].value || [];

  if (!tags.includes(value)) {
    tags.push(value);
    this.BankFormControl['banksmsCode'].setValue(tags);
  }

  this.smsCodeInput = '';
}

removeSmsCode(index: number) {
  const tags = [...this.BankFormControl['banksmsCode'].value];
  tags.splice(index, 1);
  this.BankFormControl['banksmsCode'].setValue(tags);
}

}
