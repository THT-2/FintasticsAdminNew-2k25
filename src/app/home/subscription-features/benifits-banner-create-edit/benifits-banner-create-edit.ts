import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,RequiredValidator,Validators,} from '@angular/forms';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';

@Component({
  selector: 'app-benifits-banner-create-edit',
  imports: [Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload ,
    // FilePreview  ,
    NgIf],
  templateUrl: './benifits-banner-create-edit.html',
  styleUrl: './benifits-banner-create-edit.scss',
  providers: [AlertService]
})
export class BenifitsBannerCreateEdit implements OnInit{

  benefitsForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  benefitsData: any;
  selectedimage: any;
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;
  activestatus:any[] = ["Active","Inactive"]

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
  this.benefitsForm = this.fb.group({
    icon: [null, Validators.required],
    status:[null,Validators.required],
    _id: [null],
  });
}

  get benefitsFormControl() {
    return this.benefitsForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.benefits_getlist_ById + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.benefitsData = res.data;
        this.benefitsForm.patchValue({
          icon: this.benefitsData.icon,
          status: this.benefitsData.status,
          _id: this.benefitsData._id,
        });
        this.editId = this.benefitsData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

  submit() {
    if (this.benefitsForm.valid) {
      this.btnLoader = true;
      if (this.benefitsFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.benefits_edit + "/" +  this.benefitsFormControl['_id'].value;
        this.navService.postData(apiUrl, this.benefitsForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/features']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.benefits_create;
          delete this.benefitsForm.value._id
        this.navService.postData(apiUrl, this.benefitsForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/features']);
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
      this.benefitsForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string) {
    this.benefitsFormControl['icon'].setValue(filePath);
  }

  removeImages(key:any) {
    if(key == "image") {
    this.benefitsForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.benefitsForm.patchValue({
      icon:''
    })
    }
  }
}
